'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserData, RatingData, FilterState, TMDBData, MarvelTitle, AppTheme, THEMES } from '@/types';
import { saveUserData, subscribeToUserData, updateWatchedStatus, updateWatchedEpisode, updateWatchedPostCredits, updateRating, getFirebaseAuth, isFirebaseConfigured, markOnboardingComplete, toggleHideEmail } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { searchAndGetDetails } from '@/lib/tmdb';
import { MARVEL_TITLES } from '@/data/marvelTitles';

interface AppContextType {
  user: User | null;
  authLoading: boolean;
  userData: UserData;
  tmdbData: Record<string, TMDBData>;
  filterState: FilterState;
  ambientColor: string;
  selectedTitle: MarvelTitle | null;
  isLoading: boolean;
  tmdbLoading: boolean;
  toggleWatched: (titleId: string) => void;
  toggleWatchedEpisode: (titleId: string, episodeId: number, totalEpisodes: number) => void;
  toggleWatchedPostCredits: (titleId: string) => void;
  setRating: (titleId: string, rating: RatingData) => void;
  setAmbientColor: (color: string) => void;
  setFilterState: (state: FilterState) => void;
  setSelectedTitle: (title: MarvelTitle | null) => void;
  getFilteredTitles: () => MarvelTitle[];
  isSnapped: boolean;
  setIsSnapped: (snapped: boolean) => void;
  snappedTitleIds: string[];
  setSnappedTitleIds: (ids: string[]) => void;
  activeTheme: AppTheme;
  setActiveTheme: (theme: AppTheme) => void;
  hoveredTitleId: string | null;
  setHoveredTitleId: (id: string | null) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (show: boolean) => void;
  completeOnboarding: () => void;
  setHideEmail: (hide: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>({ watched: {}, ratings: {} });
  const [tmdbData, setTmdbData] = useState<Record<string, TMDBData>>({});
  const [filterState, setFilterState] = useState<FilterState>({
    marathonMode: 'essential',
    watchStatus: 'all',
    category: 'all',
  });
  const [ambientColor, setAmbientColor] = useState('236, 29, 36'); // Marvel red
  const [selectedTitle, setSelectedTitle] = useState<MarvelTitle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [tmdbLoading, setTmdbLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<AppTheme>('mcu-default');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // Gamification & Theme State
  const [isSnapped, setIsSnapped] = useState(false);
  const [snappedTitleIds, setSnappedTitleIds] = useState<string[]>([]);
  const [hoveredTitleId, setHoveredTitleId] = useState<string | null>(null);

  // Listen to Auth State
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setAuthLoading(false);
      setUser(null);
      return;
    }
    
    try {
      const auth = getFirebaseAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return () => unsubscribeAuth();
    } catch (e) {
      console.error('Failed to initialize Firebase Auth', e);
      setAuthLoading(false);
      setUser(null);
    }
  }, []);

  // Sync to localStorage / Firebase data
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // If signed out, reset user data to empty
      setUserData({ watched: {}, ratings: {} });
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserData(user.uid, (data) => {
      setUserData(data);
      if (!data.hasSeenOnboarding) {
        setShowOnboardingModal(true);
      }
      setIsLoading(false);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading]);

  // Sync theme to document body
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const themeData = THEMES[activeTheme];
      document.documentElement.style.setProperty('--color-marvel-red', themeData.primary);
      document.body.style.backgroundColor = themeData.bg;
      document.documentElement.style.setProperty('--color-border', themeData.border);
    }
  }, [activeTheme]);

  // Load TMDB data progressively
  useEffect(() => {
    // Try to load from sessionStorage first
    const cached = typeof window !== 'undefined' ? sessionStorage.getItem('tmdb-cache-v2') : null;
    if (cached) {
      try {
        setTmdbData(JSON.parse(cached));
        setTmdbLoading(false);
        return;
      } catch {}
    }

    let cancelled = false;
    const loadTMDB = async () => {
      const results: Record<string, TMDBData> = {};
      const BATCH_SIZE = 4;

      for (let i = 0; i < MARVEL_TITLES.length; i += BATCH_SIZE) {
        if (cancelled) break;
        const batch = MARVEL_TITLES.slice(i, i + BATCH_SIZE);
        const promises = batch.map(async (t) => {
          try {
            const data = await searchAndGetDetails(t.title, t.releaseYear, t.type, t.season);
            if (data) {
              results[t.id] = data;
            }
          } catch (e) {
            console.warn(`Failed to fetch TMDB data for ${t.title}:`, e);
          }
        });
        await Promise.all(promises);

        // Update state progressively every 2 batches
        if ((i / BATCH_SIZE) % 2 === 0) {
          setTmdbData(prev => ({ ...prev, ...results }));
        }

        // Rate limit delay
        if (i + BATCH_SIZE < MARVEL_TITLES.length) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      if (!cancelled) {
        setTmdbData(prev => {
          const final = { ...prev, ...results };
          // Cache in sessionStorage
          try {
            sessionStorage.setItem('tmdb-cache-v2', JSON.stringify(final));
          } catch {}
          return final;
        });
        setTmdbLoading(false);
      }
    };

    loadTMDB();
    return () => { cancelled = true; };
  }, []);

  const toggleWatched = useCallback(async (titleId: string) => {
    const isWatched = !userData.watched[titleId];
    const newData = await updateWatchedStatus(userData, titleId, isWatched);
    setUserData(newData);
  }, [userData]);

  const toggleWatchedEpisode = useCallback(async (titleId: string, episodeId: number, totalEpisodes: number) => {
    const isWatched = userData.watchedEpisodes?.[titleId]?.includes(episodeId) || false;
    const newData = await updateWatchedEpisode(userData, titleId, episodeId, !isWatched, totalEpisodes);
    setUserData(newData);
  }, [userData]);

  const toggleWatchedPostCredits = useCallback(async (titleId: string) => {
    const isWatched = userData.watchedPostCredits?.[titleId] || false;
    const newData = await updateWatchedPostCredits(userData, titleId, !isWatched);
    setUserData(newData);
  }, [userData]);

  const setRatingFn = useCallback(async (titleId: string, rating: RatingData) => {
    const newData = await updateRating(userData, titleId, rating);
    setUserData(newData);
  }, [userData]);

  const getFilteredTitles = useCallback(() => {
    let filtered = [...MARVEL_TITLES];

    // Marathon mode filter
    if (filterState.marathonMode === 'essential') {
      filtered = filtered.filter(t => t.isEssential);
    }

    // Watch status filter
    if (filterState.watchStatus === 'watched') {
      filtered = filtered.filter(t => userData.watched[t.id]);
    } else if (filterState.watchStatus === 'unwatched') {
      filtered = filtered.filter(t => !userData.watched[t.id]);
    }

    // Category filter
    if (filterState.category === 'movies') {
      filtered = filtered.filter(t => t.type === 'movie');
    } else if (filterState.category === 'tv') {
      filtered = filtered.filter(t => t.type === 'tv');
    } else if (filterState.category === 'fox-xmen') {
      filtered = filtered.filter(t => t.category === 'fox-xmen');
    } else if (filterState.category === 'sony-spiderverse') {
      filtered = filtered.filter(t => t.category === 'sony-spiderverse');
    }

    // Sort by exact TMDB release date if available, fallback to year
    filtered.sort((a, b) => {
      const dateA = tmdbData[a.id]?.releaseDate ? new Date(tmdbData[a.id].releaseDate).getTime() : new Date(`${a.releaseYear}-12-31`).getTime();
      const dateB = tmdbData[b.id]?.releaseDate ? new Date(tmdbData[b.id].releaseDate).getTime() : new Date(`${b.releaseYear}-12-31`).getTime();
      return dateA - dateB;
    });

    return filtered;
  }, [filterState, userData.watched, tmdbData]);

  const completeOnboarding = useCallback(async () => {
    setShowOnboardingModal(false);
    const updated = await markOnboardingComplete(userData);
    setUserData(updated);
  }, [userData]);

  const setHideEmail = useCallback(async (hide: boolean) => {
    const updated = await toggleHideEmail(userData, hide);
    setUserData(updated);
  }, [userData]);

  return (
    <AppContext.Provider
      value={{
        user,
        authLoading,
        userData,
        tmdbData,
        filterState,
        ambientColor,
        selectedTitle,
        isLoading,
        tmdbLoading,
        toggleWatched,
        toggleWatchedEpisode,
        toggleWatchedPostCredits,
        setRating: setRatingFn,
        setAmbientColor,
        setFilterState,
        setSelectedTitle,
        getFilteredTitles,
        isSnapped,
        setIsSnapped,
        snappedTitleIds,
        setSnappedTitleIds,
        activeTheme,
        setActiveTheme,
        hoveredTitleId,
        setHoveredTitleId,
        showOnboardingModal,
        setShowOnboardingModal,
        completeOnboarding,
        setHideEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
