export interface MarvelTitle {
  id: string;
  title: string;
  releaseYear: number;
  type: 'movie' | 'tv';
  season?: number;
  isEssential: boolean;
  category?: string;
  postCreditScenes?: number;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  still_path: string | null;
  air_date: string;
}

export interface TMDBData {
  tmdbId: number;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  runtime: number | null;
  releaseDate: string;
  voteAverage: number;
  episodeCount?: number;
  videos?: { key: string; name: string; type: string }[];
  cast?: { id: number; name: string; character: string; profile_path: string | null }[];
}

export interface RatingData {
  storyAndPacing: number;
  visualsAndSpectacle: number;
  charactersAndPerformances: number;
  multiverseRelevance: number;
  funFactorAndVibe: number;
}

export interface UserData {
  watched: Record<string, boolean>;
  watchedEpisodes?: Record<string, number[]>; // titleId -> array of episode ids/numbers
  watchedPostCredits?: Record<string, boolean>; // titleId -> boolean
  ratings: Record<string, RatingData>;
  unlockedBadges?: string[];
  hasSeenOnboarding?: boolean;
}

export interface FilterState {
  marathonMode: 'essential' | 'all';
  watchStatus: 'all' | 'unwatched' | 'watched';
  category: 'all' | 'movies' | 'tv' | 'fox-xmen' | 'sony-spiderverse';
}

export const RATING_CATEGORIES = [
  { key: 'storyAndPacing' as const, label: 'Story & Pacing', icon: '📖' },
  { key: 'visualsAndSpectacle' as const, label: 'Visuals & Spectacle', icon: '🎬' },
  { key: 'charactersAndPerformances' as const, label: 'Characters & Performances', icon: '🎭' },
  { key: 'multiverseRelevance' as const, label: 'Multiverse Relevance', icon: '🌀' },
  { key: 'funFactorAndVibe' as const, label: 'Fun Factor & Vibe', icon: '⚡' },
] as const;

export const DEFAULT_RATING: RatingData = {
  storyAndPacing: 0,
  visualsAndSpectacle: 0,
  charactersAndPerformances: 0,
  multiverseRelevance: 0,
  funFactorAndVibe: 0,
};

export type AppTheme = 'mcu-default' | 'dark-dimension' | 'wakanda' | 'tva';

export const THEMES: Record<AppTheme, { name: string, primary: string, bg: string, border: string }> = {
  'mcu-default': { name: 'MCU Default', primary: '#EC1D24', bg: '#08080A', border: 'rgba(255,255,255,0.06)' },
  'dark-dimension': { name: 'Dark Dimension', primary: '#00FF6A', bg: '#020A05', border: 'rgba(0,255,106,0.15)' },
  'wakanda': { name: 'Wakanda Forever', primary: '#8B5CF6', bg: '#080512', border: 'rgba(139,92,246,0.2)' },
  'tva': { name: 'Time Variance Authority', primary: '#F59E0B', bg: '#171003', border: 'rgba(245,158,11,0.2)' },
};
