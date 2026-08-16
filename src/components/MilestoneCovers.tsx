'use client';

import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { getPosterUrl } from '@/lib/tmdb';
import { MARVEL_TITLES } from '@/data/marvelTitles';

const AVENGERS_MILESTONES = [
  "The Avengers",
  "Avengers: Age of Ultron",
  "Avengers: Infinity War",
  "Avengers: Endgame",
  "Avengers: Endgame Encore",
  "Avengers: Doomsday",
];

export default function MilestoneCovers() {
  const { userData, tmdbData } = useAppContext();

  const milestones = AVENGERS_MILESTONES.map(name => 
    MARVEL_TITLES.find(t => t.title === name && !t.season)
  ).filter(Boolean);

  if (milestones.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="text-sm tracking-[0.2em] uppercase text-white/50 font-medium">
          Milestone Unlocks
        </h2>
        <p className="text-xs text-white/25 mt-1">Complete the saga to reveal each cover</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {milestones.map((title, index) => {
          if (!title) return null;
          const isWatched = userData.watched[title.id];
          const tmdb = tmdbData[title.id];
          const posterUrl = tmdb ? getPosterUrl(tmdb.posterPath, 'w500') : '';

          return (
            <motion.div
              key={title.id}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-700 ${
                  isWatched
                    ? 'shadow-lg'
                    : 'grayscale brightness-[0.15]'
                }`}
                style={isWatched ? {
                  boxShadow: '0 0 30px rgba(255, 215, 0, 0.2), 0 0 60px rgba(255, 215, 0, 0.1)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: '0.75rem',
                } : {
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '0.75rem',
                }}
              >
                {posterUrl ? (
                  <motion.img
                    src={posterUrl}
                    alt={title.title}
                    className="w-full h-full object-cover"
                    animate={isWatched ? { scale: 1 } : { scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <span className="text-2xl opacity-20">?</span>
                  </div>
                )}

                {/* Gold shimmer on unlocked */}
                {isWatched && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,215,0,0.1) 0%, transparent 50%, rgba(255,215,0,0.05) 100%)',
                      }}
                    />
                  </motion.div>
                )}

                {/* Lock overlay when not watched */}
                {!isWatched && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/10 text-3xl">🔒</div>
                  </div>
                )}
              </div>

              <div className="mt-2 text-center">
                <h3 className="text-[10px] md:text-xs font-semibold text-white/60 leading-tight line-clamp-1">
                  {title.title}
                </h3>
                <span className="text-[9px] text-white/25">{title.releaseYear}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
