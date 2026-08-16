'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENTS, Achievement } from '@/lib/achievements';

export default function AchievementToast() {
  const [queue, setQueue] = useState<Achievement[]>([]);

  useEffect(() => {
    const handleNewAchievement = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      const badgeIds = customEvent.detail;
      const newBadges = badgeIds.map(id => ACHIEVEMENTS.find(a => a.id === id)).filter(Boolean) as Achievement[];
      
      setQueue(prev => [...prev, ...newBadges]);
    };

    window.addEventListener('new-achievement', handleNewAchievement);
    return () => window.removeEventListener('new-achievement', handleNewAchievement);
  }, []);

  useEffect(() => {
    if (queue.length > 0) {
      const timer = setTimeout(() => {
        setQueue(prev => prev.slice(1));
      }, 5000); // Show each for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [queue]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {queue.length > 0 && (
          <motion.div
            key={queue[0].id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="glass-panel-solid border-yellow-500/50 p-4 rounded-xl flex items-center gap-4 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-yellow-500/10 backdrop-blur-xl pointer-events-auto"
          >
            <div className="text-4xl filter drop-shadow-md animate-bounce">
              {queue[0].icon}
            </div>
            <div>
              <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-widest mb-1">
                Achievement Unlocked
              </div>
              <div className="text-sm font-bold text-white leading-tight">
                {queue[0].name}
              </div>
              <div className="text-xs text-white/70">
                {queue[0].description}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
