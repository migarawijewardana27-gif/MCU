'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarvelIntroLoader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'flash' | 'done'>('loading');

  useEffect(() => {
    const lastShown = sessionStorage.getItem('marvel-intro-shown');
    if (lastShown && Date.now() - parseInt(lastShown) < 600000) {
      setPhase('done');
      onComplete();
      return;
    }

    const duration = 3000;
    const interval = 30;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.min(100, Math.round(eased * 100)));

      if (step >= steps) {
        clearInterval(timer);
        setPhase('flash');
        sessionStorage.setItem('marvel-intro-shown', Date.now().toString());
        setTimeout(() => {
          setPhase('done');
          onComplete();
        }, 600);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#EC1D24' }}
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.1,
          filter: 'brightness(2)',
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        {/* Subtle radial overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.3) 100%)',
          }}
        />

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center gap-10">
          {/* Marvel Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <img
              src="/marvel-logo.svg"
              alt="Marvel"
              className="h-20 md:h-28 w-auto drop-shadow-2xl"
              style={{ filter: 'brightness(1.1) drop-shadow(0 0 40px rgba(255,255,255,0.3))' }}
            />
          </motion.div>

          {/* Progress counter */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl md:text-7xl font-black text-white tracking-tight tabular-nums" style={{ textShadow: '0 0 40px rgba(255,255,255,0.4)' }}>
              {progress}%
            </div>
            <div className="text-white/50 text-xs mt-3 tracking-[0.3em] uppercase font-medium">
              Assembling the Multiverse
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.6), #fff)',
                boxShadow: '0 0 12px rgba(255,255,255,0.5)',
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </div>

        {/* Flash effect */}
        {phase === 'flash' && (
          <motion.div
            className="absolute inset-0 bg-white z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
