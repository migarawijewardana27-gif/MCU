'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import MediaCard from './MediaCard';
import { motion, AnimatePresence } from 'framer-motion';

const INFINITY_WAR_ID = 'avengers__infinity_war_2018';
const ENDGAME_ID = 'avengers__endgame_2019';

export default function MediaGrid() {
  const { 
    getFilteredTitles, 
    tmdbLoading, 
    userData, 
    isSnapped, 
    setIsSnapped, 
    snappedTitleIds, 
    setSnappedTitleIds
  } = useAppContext();
  
  const allTitles = getFilteredTitles();
  const prevWatchedRef = useRef<Record<string, boolean>>({});
  const hasInitialized = useRef(false);
  const [showFlash, setShowFlash] = useState(false);

  // DOM-based dusting effect
  const applyDustingEffect = useCallback((elementId: string) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    parent.style.position = 'relative';
    
    // Create particles container
    const container = document.createElement('div');
    container.style.cssText = `position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;overflow:visible;`;
    parent.appendChild(container);

    // Number of particles
    const particleCount = 40;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < particleCount; i++) {
      const p = document.createElement('div');
      const size = 3 + Math.random() * 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Ash/dust color
      const shade = 100 + Math.random() * 50;
      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(${shade}, ${shade}, ${shade}, ${0.5 + Math.random() * 0.5});
        left: ${x}%;
        top: ${y}%;
        border-radius: 50%;
        box-shadow: 0 0 ${size}px rgba(100, 90, 80, 0.8);
      `;
      container.appendChild(p);
      particles.push(p);
    }

    // Fade out original element
    el.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), filter 1.5s ease-out';
    el.style.opacity = '0';
    el.style.filter = 'blur(10px) sepia(50%) hue-rotate(-30deg)';

    // Animate particles
    particles.forEach((p) => {
      const angle = (Math.random() - 0.5) * Math.PI; 
      const dist = 50 + Math.random() * 100;
      const delay = Math.random() * 400;
      const duration = 1000 + Math.random() * 1000;

      p.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { 
          transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist - 50}px) scale(0)`, 
          opacity: 0 
        }
      ], {
        duration,
        delay,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });
    });

    // Cleanup
    setTimeout(() => {
      container.remove();
    }, 2500);
  }, []);

  // Detect Snap / Blip
  useEffect(() => {
    // Skip on first render to avoid snapping on page load
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      prevWatchedRef.current = { ...userData.watched };
      return;
    }

    const prev = prevWatchedRef.current;
    const current = userData.watched;

    // The Snap: Infinity War just marked as watched, Endgame not yet watched
    if (!prev[INFINITY_WAR_ID] && current[INFINITY_WAR_ID] && !current[ENDGAME_ID] && !isSnapped) {
      const unwatchedIds = allTitles
        .filter(t => !current[t.id] && t.id !== INFINITY_WAR_ID)
        .map(t => t.id);
      
      const toSnap = unwatchedIds
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(unwatchedIds.length / 2));

      setSnappedTitleIds(toSnap);
      setIsSnapped(true);

      // Stagger the dusting effect
      toSnap.forEach((id, i) => {
        setTimeout(() => applyDustingEffect(`card-${id}`), i * 150);
      });
    }

    // The Blip: Endgame just marked as watched while snapped
    if (!prev[ENDGAME_ID] && current[ENDGAME_ID] && isSnapped) {
      setIsSnapped(false);
      setSnappedTitleIds([]);
      // Reverse snap flash
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);
    }

    prevWatchedRef.current = { ...current };
  }, [userData.watched, allTitles, isSnapped, setIsSnapped, setSnappedTitleIds, applyDustingEffect]);

  // Listen to manual snap trigger from ProgressDashboard
  useEffect(() => {
    const handleManualSnap = (e: Event) => {
      const customEvent = e as CustomEvent<string[]>;
      const toSnap = customEvent.detail;
      
      // Cinematic flash
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 2000);

      // Stagger dusting
      toSnap.forEach((id, i) => {
        setTimeout(() => applyDustingEffect(`card-${id}`), i * 150 + 500); // Wait for flash to peek
      });
    };

    window.addEventListener('thanos-snap', handleManualSnap);
    return () => window.removeEventListener('thanos-snap', handleManualSnap);
  }, [applyDustingEffect]);

  // After snap, filter out the snapped cards
  const visibleTitles = isSnapped
    ? allTitles.filter(t => !snappedTitleIds.includes(t.id))
    : allTitles;

  return (
    <>
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="fixed inset-0 bg-white z-[9999] pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>
      <div className="max-w-7xl mx-auto px-4 py-8 relative" id="media-grid">
      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs text-white/40 tracking-[0.15em] uppercase font-medium">
          {visibleTitles.length} Titles
        </span>
        {tmdbLoading && (
          <span className="text-[10px] text-marvel-red/70 tracking-wider uppercase animate-pulse">
            Loading posters...
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        <AnimatePresence mode="popLayout">
          {visibleTitles.map((title, index) => (
            <MediaCard key={title.id} title={title} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {visibleTitles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4 opacity-40">🌌</div>
          <h3 className="text-lg font-bold text-white/60 mb-1">No timelines found</h3>
          <p className="text-sm text-white/30">Try adjusting your filters</p>
        </div>
      )}
    </div>
    </>
  );
}
