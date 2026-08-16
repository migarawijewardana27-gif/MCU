import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { UserData, RatingData } from '@/types';
import { checkNewAchievements } from './achievements';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function isFirebaseConfigured(): boolean {
  return !!(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getApp(): FirebaseApp {
  if (!app) {
    if (getApps().length > 0) {
      app = getApps()[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
  }
  return app;
}

function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getApp());
  }
  return db;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getApp());
  }
  return auth;
}

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const authInstance = getFirebaseAuth();
  return signInWithPopup(authInstance, provider);
};

export const signOutUser = async () => {
  const authInstance = getFirebaseAuth();
  return signOut(authInstance);
};

// --- localStorage fallback ---
const LS_KEY = 'marvel-tracker-data';

function getLocalData(): UserData {
  if (typeof window === 'undefined') return { watched: {}, ratings: {} };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { watched: {}, ratings: {} };
}

function setLocalData(data: UserData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch {}
}

// --- Public API ---

export async function saveUserData(data: UserData): Promise<void> {
  // Check for new achievements before saving
  const newBadges = checkNewAchievements(data);
  if (newBadges.length > 0) {
    data.unlockedBadges = [...(data.unlockedBadges || []), ...newBadges];
    // Dispatch a custom event so the UI can show a toast
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('new-achievement', { detail: newBadges }));
    }
  }

  // Always save to localStorage as backup
  setLocalData(data);

  if (!isFirebaseConfigured()) return;

  try {
    const authInstance = getFirebaseAuth();
    const userId = authInstance.currentUser?.uid;
    
    if (!userId) {
      console.warn('No authenticated user, not saving to Firestore.');
      return;
    }

    const firestore = getDb();
    const docRef = doc(firestore, 'users', userId);
    await setDoc(docRef, {
      watched: data.watched,
      watchedEpisodes: data.watchedEpisodes || {},
      watchedPostCredits: data.watchedPostCredits || {},
      ratings: data.ratings,
      unlockedBadges: data.unlockedBadges || [],
      hasSeenOnboarding: data.hasSeenOnboarding || false,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Firebase save error:', error);
  }
}

export function subscribeToUserData(
  userId: string,
  callback: (data: UserData) => void
): (() => void) | null {
  if (!isFirebaseConfigured() || !userId) {
    // Fall back to localStorage if no Firebase or no user
    callback(getLocalData());
    return null;
  }

  try {
    const firestore = getDb();
    const docRef = doc(firestore, 'users', userId);

    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const userData: UserData = {
          watched: data.watched || {},
          watchedEpisodes: data.watchedEpisodes || {},
          watchedPostCredits: data.watchedPostCredits || {},
          ratings: data.ratings || {},
          unlockedBadges: data.unlockedBadges || [],
          hasSeenOnboarding: data.hasSeenOnboarding || false,
        };
        // Also sync to localStorage for backup/offline
        setLocalData(userData);
        callback(userData);
      } else {
        // First time user — load from localStorage if exists (migration), otherwise empty
        const local = getLocalData();
        callback(local);
        // Push local data to Firestore if it exists
        if (Object.keys(local.watched).length > 0 || Object.keys(local.ratings).length > 0) {
          saveUserData(local);
        }
      }
    }, (error) => {
      console.error('Firestore subscription error:', error);
      // Fallback to localStorage
      callback(getLocalData());
    });
  } catch (error) {
    console.error('Firebase subscribe error:', error);
    callback(getLocalData());
    return null;
  }
}

export async function updateWatchedStatus(
  currentData: UserData,
  titleId: string,
  watched: boolean
): Promise<UserData> {
  const newData: UserData = {
    ...currentData,
    watched: { ...currentData.watched, [titleId]: watched },
  };
  if (!watched) {
    // Remove rating when unwatching
    const newRatings = { ...newData.ratings };
    delete newRatings[titleId];
    newData.ratings = newRatings;
    
    // Also remove watchedEpisodes if we unwatch the whole season
    if (newData.watchedEpisodes) {
      const newWatchedEpisodes = { ...newData.watchedEpisodes };
      delete newWatchedEpisodes[titleId];
      newData.watchedEpisodes = newWatchedEpisodes;
    }
  }
  await saveUserData(newData);
  return newData;
}

export async function updateWatchedEpisode(
  currentData: UserData,
  titleId: string,
  episodeId: number,
  watched: boolean,
  totalEpisodes: number
): Promise<UserData> {
  const currentWatchedEpisodes = currentData.watchedEpisodes?.[titleId] || [];
  let newWatchedEpisodesList;
  if (watched) {
    newWatchedEpisodesList = Array.from(new Set([...currentWatchedEpisodes, episodeId]));
  } else {
    newWatchedEpisodesList = currentWatchedEpisodes.filter(id => id !== episodeId);
  }

  const newData: UserData = {
    ...currentData,
    watchedEpisodes: {
      ...(currentData.watchedEpisodes || {}),
      [titleId]: newWatchedEpisodesList,
    },
  };

  // If all episodes are watched, mark the season as watched
  if (newWatchedEpisodesList.length === totalEpisodes && totalEpisodes > 0) {
    newData.watched = { ...currentData.watched, [titleId]: true };
  } else if (newData.watched[titleId] && newWatchedEpisodesList.length < totalEpisodes) {
    // If not all episodes are watched, unmark the season
    newData.watched = { ...currentData.watched, [titleId]: false };
    const newRatings = { ...newData.ratings };
    delete newRatings[titleId];
    newData.ratings = newRatings;
  }

  await saveUserData(newData);
  return newData;
}

export async function updateRating(
  currentData: UserData,
  titleId: string,
  rating: RatingData
): Promise<UserData> {
  const newData: UserData = {
    ...currentData,
    ratings: { ...currentData.ratings, [titleId]: rating },
  };
  await saveUserData(newData);
  return newData;
}

export async function updateWatchedPostCredits(
  currentData: UserData,
  titleId: string,
  watched: boolean
): Promise<UserData> {
  const newData: UserData = {
    ...currentData,
    watchedPostCredits: { ...(currentData.watchedPostCredits || {}), [titleId]: watched },
  };
  await saveUserData(newData);
  return newData;
}

export async function markOnboardingComplete(currentData: UserData): Promise<UserData> {
  const newData: UserData = {
    ...currentData,
    hasSeenOnboarding: true,
  };
  await saveUserData(newData);
  return newData;
}
