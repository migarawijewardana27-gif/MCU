'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { getPosterUrl, getBackdropUrl, getSeasonEpisodes, getStillUrl } from '@/lib/tmdb';
import { extractDominantColor } from '@/lib/colorExtractor';
import { DEFAULT_RATING, TMDBEpisode } from '@/types';
import RatingSliders from './RatingSliders';
import GiphyReactionModal from './GiphyReactionModal';
import { Play as PlayIcon, ExternalLink } from 'lucide-react';
export default function DetailModal() {
  const {
    selectedTitle,
    setSelectedTitle,
    userData,
    tmdbData,
    toggleWatched,
    toggleWatchedEpisode,
    setRating,
    ambientColor,
    setAmbientColor,
    toggleWatchedPostCredits
  } = useAppContext();

  const [showGiphy, setShowGiphy] = useState(false);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [activeTrailerKey, setActiveTrailerKey] = useState<string | null>(null);


  const title = selectedTitle;
  const tmdb = title ? tmdbData[title.id] : null;
  const isWatched = title ? !!userData.watched[title.id] : false;
  const ratings = title ? userData.ratings[title.id] || DEFAULT_RATING : DEFAULT_RATING;

  const displayTitle = title?.season
    ? `${title.title} Season ${title.season}`
    : title?.title || '';

  const posterUrl = tmdb ? getPosterUrl(tmdb.posterPath) : '';
  const backdropUrl = tmdb ? getBackdropUrl(tmdb.backdropPath) : '';

  // Color extraction
  useEffect(() => {
    if (!tmdb?.posterPath) return;
    const smallUrl = getPosterUrl(tmdb.posterPath, 'w92');
    if (smallUrl) {
      extractDominantColor(smallUrl).then(setAmbientColor);
    }
  }, [tmdb?.posterPath, setAmbientColor]);

  // Fetch episodes for TV shows
  useEffect(() => {
    if (title?.type === 'tv' && title.season && tmdb?.tmdbId) {
      setLoadingEpisodes(true);
      getSeasonEpisodes(tmdb.tmdbId, title.season)
        .then(data => {
          setEpisodes(data);
          setLoadingEpisodes(false);
        })
        .catch(() => {
          setLoadingEpisodes(false);
        });
    } else {
      setEpisodes([]);
    }
  }, [title, tmdb]);

  const handleClose = useCallback(() => {
    setSelectedTitle(null);
    setAmbientColor('236, 29, 36');
    setActiveTrailerKey(null);
  }, [setSelectedTitle, setAmbientColor]);

  const handleToggleWatched = useCallback(() => {
    if (title) {
      if (!isWatched) setShowGiphy(true);
      toggleWatched(title.id);
    }
  }, [title, isWatched, toggleWatched]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') {
        if (activeTrailerKey) {
          setActiveTrailerKey(null);
        } else {
          handleClose();
        }
      } 
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleClose, activeTrailerKey]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = selectedTitle ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedTitle]);

  const runtimeDisplay = tmdb?.runtime
    ? tmdb.runtime >= 60
      ? `${Math.floor(tmdb.runtime / 60)}h ${tmdb.runtime % 60}m`
      : `${tmdb.runtime}m`
    : null;

  const cineHdUrl = tmdb?.tmdbId
    ? (title?.type === 'tv' 
        ? `https://cinehd.vc/tv/${tmdb.tmdbId}`
        : `https://cinehd.vc/movie/${tmdb.tmdbId}`)
    : title?.title 
        ? `https://cinehd.vc/search?q=${encodeURIComponent(title.title)}`
        : '#';

  return (
    <>
      <AnimatePresence>
        {selectedTitle && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop with ambient color glow */}
            <motion.div
              className="absolute inset-0"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
              <div
                className="absolute inset-0 opacity-30 transition-all duration-700"
                style={{
                  background: `radial-gradient(circle at center, rgba(${ambientColor}, 0.5) 0%, transparent 70%)`,
                }}
              />
            </motion.div>

            {/* Modal */}
            <motion.div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl glass-panel-solid z-10"
              style={{
                boxShadow: `0 0 80px rgba(${ambientColor}, 0.15), 0 25px 50px rgba(0,0,0,0.5)`,
                '--color-marvel-red': `rgb(${ambientColor})`,
              } as React.CSSProperties}
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-50 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white/70 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Backdrop banner */}
              {backdropUrl && (
                <div className="relative h-48 md:h-64 overflow-hidden rounded-t-2xl">
                  <img
                    src={backdropUrl}
                    alt={displayTitle}
                    className="w-full h-full object-cover ken-burns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/40 to-transparent" />
                </div>
              )}

              {/* Content */}
              <div className="relative px-6 pb-8 -mt-20 z-20">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Poster */}
                  <div className="flex-shrink-0 w-32 md:w-44 mx-auto md:mx-0">
                    <div
                      className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl border border-white/10"
                      style={{ boxShadow: `0 0 30px rgba(${ambientColor}, 0.2)` }}
                    >
                      {posterUrl ? (
                        <img src={posterUrl} alt={displayTitle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <span className="text-4xl opacity-30">🎬</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 pt-4 md:pt-20">
                    <h2 className="text-2xl md:text-4xl font-black text-white mb-3 leading-tight">
                      {displayTitle}
                    </h2>

                    {/* Meta pills */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="px-2.5 py-1 text-[10px] font-medium uppercase rounded-lg bg-white/10 text-white/70 tracking-wider">
                        {title?.releaseYear}
                      </span>
                      <span className={`px-2.5 py-1 text-[10px] font-medium uppercase rounded-lg tracking-wider ${
                        title?.type === 'tv' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {title?.type === 'tv' ? 'TV Series' : 'Movie'}
                      </span>
                      {runtimeDisplay && (
                        <span className="px-2.5 py-1 text-[10px] font-medium uppercase rounded-lg bg-white/10 text-white/70 tracking-wider">
                          {runtimeDisplay}
                        </span>
                      )}
                      {title?.isEssential && (
                        <span className="px-2.5 py-1 text-[10px] font-medium uppercase rounded-lg bg-marvel-red/20 text-red-300 tracking-wider">
                          Essential
                        </span>
                      )}
                      {tmdb?.voteAverage ? (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-yellow-500/20 text-yellow-300">
                          ★ {tmdb.voteAverage.toFixed(1)}
                        </span>
                      ) : null}
                    </div>

                    {/* Synopsis */}
                    {tmdb?.overview && (
                      <p className="text-sm text-white/60 leading-relaxed mb-6">
                        {tmdb.overview}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <a
                        href={cineHdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-2.5 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-xl transition-transform hover:scale-105 flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                      >
                        <PlayIcon size={16} fill="currentColor" /> Play Now
                        <ExternalLink size={14} className="opacity-50 ml-1" />
                      </a>
                      
                      {tmdb?.videos && tmdb.videos.some(v => v.type === 'Trailer') && (
                        <button
                          onClick={() => {
                            const trailer = tmdb.videos?.find(v => v.type === 'Trailer');
                            if (trailer) setActiveTrailerKey(trailer.key);
                          }}
                          className="px-6 py-2.5 bg-[var(--color-marvel-red)] text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-transform hover:scale-105 flex items-center gap-2"
                          style={{ boxShadow: `0 0 20px rgba(${ambientColor}, 0.5)` }}
                        >
                          <PlayIcon size={16} fill="currentColor" /> Watch Trailer
                        </button>
                      )}
                    </div>





                    {/* Action Area */}
                    {title?.type === 'tv' && title.season ? (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm tracking-[0.15em] uppercase text-white/50 font-medium">Episodes</h3>
                          <span className="text-xs text-white/40">{episodes.length} Episodes</span>
                        </div>
                        {loadingEpisodes ? (
                          <div className="flex justify-center py-4">
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {episodes.map((ep) => {
                              const isEpWatched = userData.watchedEpisodes?.[title.id]?.includes(ep.id) || false;
                              const stillUrl = getStillUrl(ep.still_path);
                              return (
                                <button
                                  key={ep.id}
                                  onClick={() => toggleWatchedEpisode(title.id, ep.id, episodes.length)}
                                  className={`flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
                                    isEpWatched
                                      ? 'bg-green-500/10 border border-green-500/20'
                                      : 'bg-white/5 border border-white/5 hover:bg-white/10'
                                  }`}
                                >
                                  {/* Episode Thumbnail */}
                                  <div className="flex-shrink-0 w-28 h-16 rounded-md overflow-hidden relative">
                                    {stillUrl ? (
                                      <img
                                        src={stillUrl}
                                        alt={`Episode ${ep.episode_number}`}
                                        className={`w-full h-full object-cover transition-all ${
                                          isEpWatched ? 'brightness-50' : ''
                                        }`}
                                        loading="lazy"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                        <span className="text-lg opacity-30">🎬</span>
                                      </div>
                                    )}
                                    {isEpWatched && (
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                          <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                          </svg>
                                        </div>
                                      </div>
                                    )}
                                    {/* Episode number badge */}
                                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white/80">
                                      E{ep.episode_number}
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white/90 line-clamp-1">
                                      {ep.name}
                                    </div>
                                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{ep.overview}</div>
                                    {ep.air_date && (
                                      <div className="text-[10px] text-white/25 mt-1">{ep.air_date}</div>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={handleToggleWatched}
                        className={`w-full py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-500 ${
                          isWatched
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-white/10 text-white/90 border border-white/10 hover:bg-white/15'
                        }`}
                        style={!isWatched ? {
                          boxShadow: `0 0 20px rgba(${ambientColor}, 0.15)`,
                        } : undefined}
                      >
                        {isWatched ? '✓ Watched' : '○ Mark as Watched'}
                      </button>
                    )}
                  </div>
                </div>


                {/* Rating section */}
                {isWatched && title && (
                  <motion.div
                    className="mt-8 p-6 rounded-xl glass-panel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {title.postCreditScenes !== undefined && title.postCreditScenes > 0 && (
                      <div className="mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm tracking-[0.15em] uppercase text-white/90 font-bold mb-1">Post-Credits Scenes</h3>
                            <p className="text-xs text-white/50">This title has {title.postCreditScenes} post-credits scene(s). Did you stay for them?</p>
                          </div>
                          <button
                            onClick={() => toggleWatchedPostCredits(title.id)}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                              userData.watchedPostCredits?.[title.id]
                                ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                                : 'bg-white/5 text-white/30 border-2 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <span className="text-xl">✨</span>
                            {userData.watchedPostCredits?.[title.id] && (
                              <svg className="absolute -bottom-1 -right-1 w-5 h-5 text-green-400 bg-black rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-sm tracking-[0.15em] uppercase text-white/50 font-medium mb-4">Rate this Title</h3>
                    <RatingSliders
                      ratings={ratings}
                      onChange={(newRatings) => setRating(title.id, newRatings)}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <GiphyReactionModal isOpen={showGiphy} onClose={() => setShowGiphy(false)} />

      {/* Full Screen Trailer Modal */}
      <AnimatePresence>
        {activeTrailerKey && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <button 
              onClick={() => setActiveTrailerKey(null)}
              className="absolute top-6 right-6 z-[210] w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.1)] border border-white/10 relative">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeTrailerKey}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
