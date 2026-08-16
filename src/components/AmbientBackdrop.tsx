'use client';

import { useAppContext } from '@/context/AppContext';
import { getBackdropUrl } from '@/lib/tmdb';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AmbientBackdrop() {
  const { hoveredTitleId, tmdbData, activeTheme } = useAppContext();
  const [activeBackdrop, setActiveBackdrop] = useState<string | null>(null);

  useEffect(() => {
    if (hoveredTitleId) {
      const tmdb = tmdbData[hoveredTitleId];
      if (tmdb?.backdropPath) {
        setActiveBackdrop(getBackdropUrl(tmdb.backdropPath));
      }
    } else {
      // Revert to null when nothing hovered, so theme color takes over
      setActiveBackdrop(null);
    }
  }, [hoveredTitleId, tmdbData]);

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden bg-black transition-colors duration-1000" style={{ backgroundColor: `var(--theme-bg, #000)` }}>
      <AnimatePresence>
        {activeBackdrop && (
          <motion.img
            key={activeBackdrop}
            src={activeBackdrop}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.4, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover blur-[100px] mix-blend-screen"
            alt=""
          />
        )}
      </AnimatePresence>
    </div>
  );
}
