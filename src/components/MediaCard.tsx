'use client';

import { useAppContext } from '@/context/AppContext';
import { MarvelTitle } from '@/types';
import { getPosterUrl } from '@/lib/tmdb';
import { motion } from 'framer-motion';

export default function MediaCard({ title, index }: { title: MarvelTitle; index: number }) {
  const { userData, tmdbData, setSelectedTitle, ambientColor, setHoveredTitleId } = useAppContext();

  const tmdb = tmdbData[title.id];
  const isWatched = userData.watched[title.id];
  const posterUrl = tmdb ? getPosterUrl(tmdb.posterPath) : '';
  const displayTitle = title.season
    ? `${title.title} S${title.season}`
    : title.title;

  const rating = userData.ratings[title.id];
  const avgRating = rating
    ? (rating.storyAndPacing + rating.visualsAndSpectacle + rating.charactersAndPerformances + rating.multiverseRelevance + rating.funFactorAndVibe) / 5
    : null;

  return (
    <motion.div
      id={`card-${title.id}`}
      className="group relative cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.015, 0.4) }}
      onClick={() => setSelectedTitle(title)}
      onMouseEnter={() => setHoveredTitleId(title.id)}
      onMouseLeave={() => setHoveredTitleId(null)}
      layout
    >
      <motion.div
        className="relative overflow-hidden rounded-xl glass-panel transition-all duration-300"
        whileHover={{
          scale: 1.03,
          y: -4,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          boxShadow: 'none',
        }}
      >
        {/* Hover glow border */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(${ambientColor}, 0.3), 0 0 20px rgba(${ambientColor}, 0.15)`,
          }}
        />

        {/* Poster */}
        <div className="relative aspect-[2/3] bg-white/5 overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={displayTitle}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white/20">
                <div className="text-3xl mb-2">🎬</div>
                <div className="text-[10px] uppercase tracking-wider">Loading...</div>
              </div>
            </div>
          )}

          {/* Gradient overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Watched overlay or Progress Bar */}
          {isWatched ? (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full bg-green-500/90 flex items-center justify-center backdrop-blur-sm">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          ) : (
            title.type === 'tv' && userData.watchedEpisodes?.[title.id]?.length ? (
              <div className="absolute bottom-12 inset-x-3 z-10">
                <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((userData.watchedEpisodes[title.id].length) / (tmdb?.episodeCount || 8)) * 100)}%` }}
                  />
                </div>
                <div className="text-[9px] font-bold text-white/70 mt-1 uppercase tracking-wider text-right">
                  {userData.watchedEpisodes[title.id].length} / {tmdb?.episodeCount || '?'} Ep
                </div>
              </div>
            ) : null
          )}

          {/* Type badge */}
          <div className="absolute top-2 left-2 z-10">
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-md backdrop-blur-md ${
              title.type === 'tv'
                ? 'bg-purple-500/70 text-white'
                : 'bg-blue-500/70 text-white'
            }`}>
              {title.type === 'tv' ? (title.season ? `S${title.season}` : 'TV') : 'Film'}
            </span>
          </div>

          {/* Rating badge */}
          {avgRating !== null && avgRating > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-yellow-500/80 text-black backdrop-blur-md">
                ★ {avgRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Post-credits badge */}
          {title.postCreditScenes && title.postCreditScenes > 0 && (
            <div className="absolute top-9 right-2 z-10">
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-white/20 text-white backdrop-blur-md border border-white/30 flex items-center gap-1 shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                <span className="animate-pulse">✨</span> {title.postCreditScenes}
              </span>
            </div>
          )}

          {/* Title at bottom */}
          <div className="absolute bottom-0 inset-x-0 p-3 z-10">
            <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
              {displayTitle}
            </h3>
            <span className="text-[10px] text-white/50 font-medium">
              {title.releaseYear}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
