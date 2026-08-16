'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { MarvelTitle } from '@/types';
import { MARVEL_TITLES } from '@/data/marvelTitles';

export default function SideQuestRandomizer() {
  const { setSelectedTitle, userData } = useAppContext();
  const [anomalyTitle, setAnomalyTitle] = useState<MarvelTitle | null>(null);

  const handleTrigger = () => {
    const optionalUnwatched = MARVEL_TITLES.filter(t => !t.isEssential && !userData.watched[t.id]);
    const pool = optionalUnwatched.length > 0
      ? optionalUnwatched
      : MARVEL_TITLES.filter(t => !t.isEssential);
    
    if (pool.length > 0) {
      setAnomalyTitle(pool[Math.floor(Math.random() * pool.length)]);
    }
  };

  const acceptQuest = () => {
    if (anomalyTitle) {
      setSelectedTitle(anomalyTitle);
      setAnomalyTitle(null);
    }
  };

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={handleTrigger}
        className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500/20 hover:border-purple-500/30 transition-all duration-300 text-sm font-medium"
      >
        <span className="text-lg group-hover:animate-spin" style={{ animationDuration: '2s' }}>🌀</span>
        Multiverse Side-Quest
      </button>

      <AnimatePresence>
        {anomalyTitle && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAnomalyTitle(null)}
            />
            
            <motion.div
              className="relative w-full max-w-sm rounded-2xl glass-panel-solid p-8 text-center z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="text-5xl mb-5">🌀</div>
              <h2 className="text-xl font-black text-purple-400 mb-2 uppercase tracking-wider">
                Anomaly Detected
              </h2>
              <p className="text-white/40 text-xs mb-6">
                A multiverse branch has opened. Explore this timeline?
              </p>
              
              <div className="glass-panel rounded-xl p-4 mb-6">
                <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Target</div>
                <div className="text-lg font-bold text-white">
                  {anomalyTitle.title} {anomalyTitle.season ? `S${anomalyTitle.season}` : ''}
                </div>
                <div className="text-xs text-white/40 mt-1">{anomalyTitle.releaseYear}</div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setAnomalyTitle(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/50 text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={acceptQuest}
                  className="flex-1 py-2.5 rounded-xl bg-purple-500/20 text-purple-300 text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                >
                  Enter Portal
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
