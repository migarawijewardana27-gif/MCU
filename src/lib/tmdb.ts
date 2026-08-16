import { TMDBData, TMDBEpisode } from '@/types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN || '';

const headers = {
  'Authorization': `Bearer ${READ_TOKEN}`,
  'Content-Type': 'application/json',
};

// In-memory cache for the session
const tmdbCache: Record<string, TMDBData> = {};

export function getPosterUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '';
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

export function getBackdropUrl(path: string | null, size: string = 'w1280'): string {
  if (!path) return '';
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

export function getStillUrl(path: string | null, size: string = 'w300'): string {
  if (!path) return '';
  return `${TMDB_IMG_BASE}/${size}${path}`;
}

export async function getSeasonEpisodes(tvId: number, seasonNumber: number): Promise<TMDBEpisode[]> {
  const url = `${TMDB_BASE}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`;
  try {
    const res = await fetch(url, { headers, next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.episodes || [];
  } catch (error) {
    console.error("Failed to fetch season episodes:", error);
    return [];
  }
}

export async function searchAndGetDetails(
  title: string,
  year: number,
  type: 'movie' | 'tv',
  season?: number
): Promise<TMDBData | null> {
  const cacheKey = `${title}-${year}-${type}-${season || ''}-v2`;
  if (tmdbCache[cacheKey]) return tmdbCache[cacheKey];

  try {
    // Search for the title
    const searchType = type === 'movie' ? 'movie' : 'tv';
    const searchUrl = `${TMDB_BASE}/search/${searchType}?query=${encodeURIComponent(title)}&year=${year}&api_key=${API_KEY}`;

    const searchRes = await fetch(searchUrl, { headers, next: { revalidate: 86400 } });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      // Try without year
      const fallbackUrl = `${TMDB_BASE}/search/${searchType}?query=${encodeURIComponent(title)}&api_key=${API_KEY}`;
      const fallbackRes = await fetch(fallbackUrl, { headers, next: { revalidate: 86400 } });
      if (!fallbackRes.ok) return null;
      const fallbackData = await fallbackRes.json();
      if (!fallbackData.results || fallbackData.results.length === 0) return null;
      searchData.results = fallbackData.results;
    }

    const match = searchData.results[0];
    const tmdbId = match.id;

    // Get detailed info with videos and credits
    const detailUrl = `${TMDB_BASE}/${searchType}/${tmdbId}?api_key=${API_KEY}&append_to_response=videos,credits`;
    const detailRes = await fetch(detailUrl, { headers, next: { revalidate: 86400 } });
    if (!detailRes.ok) return null;
    const detail = await detailRes.json();

    let runtime: number | null = null;
    let episodeCount: number | undefined = undefined;
    if (type === 'movie') {
      runtime = detail.runtime || null;
    } else {
      // For TV, estimate based on episode count and average episode runtime
      if (season && detail.seasons) {
        const seasonData = detail.seasons.find((s: { season_number: number }) => s.season_number === season);
        episodeCount = seasonData?.episode_count || 8;
        const avgRuntime = detail.episode_run_time?.[0] || 45;
        runtime = (episodeCount || 8) * avgRuntime;
      } else {
        episodeCount = detail.number_of_episodes || 8;
        const avgRuntime = detail.episode_run_time?.[0] || 45;
        runtime = (episodeCount || 8) * avgRuntime;
      }
    }

    const videos = detail.videos?.results?.map((v: any) => ({
      key: v.key,
      name: v.name,
      type: v.type
    })) || [];

    const cast = detail.credits?.cast?.slice(0, 10).map((c: any) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path
    })) || [];

    const result: TMDBData = {
      tmdbId,
      posterPath: match.poster_path || null,
      backdropPath: match.backdrop_path || null,
      overview: match.overview || detail.overview || 'No synopsis available.',
      runtime,
      releaseDate: type === 'movie'
        ? (match.release_date || '')
        : (match.first_air_date || ''),
      voteAverage: match.vote_average || 0,
      episodeCount,
      videos,
      cast,
    };

    tmdbCache[cacheKey] = result;
    return result;
  } catch (error) {
    console.error(`TMDB fetch error for "${title}":`, error);
    return null;
  }
}

// Batch fetch for initial load — fetches in parallel with rate limiting
export async function batchFetchTMDB(
  titles: Array<{ title: string; releaseYear: number; type: 'movie' | 'tv'; season?: number; id: string }>
): Promise<Record<string, TMDBData>> {
  const results: Record<string, TMDBData> = {};
  const BATCH_SIZE = 5; // TMDB rate limit is ~40/10s

  for (let i = 0; i < titles.length; i += BATCH_SIZE) {
    const batch = titles.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (t) => {
      const data = await searchAndGetDetails(t.title, t.releaseYear, t.type, t.season);
      if (data) {
        results[t.id] = data;
      }
    });
    await Promise.all(promises);
    // Small delay between batches
    if (i + BATCH_SIZE < titles.length) {
      await new Promise(resolve => setTimeout(resolve, 250));
    }
  }

  return results;
}
