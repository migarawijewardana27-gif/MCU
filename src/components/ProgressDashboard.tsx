'use client';

import { useAppContext } from '@/context/AppContext';
import { MARVEL_TITLES } from '@/data/marvelTitles';
import { motion } from 'framer-motion';

export default function ProgressDashboard() {
  const { userData, tmdbData, filterState, isSnapped, setIsSnapped, snappedTitleIds, setSnappedTitleIds } = useAppContext();

  const relevantTitles = filterState.marathonMode === 'essential'
    ? MARVEL_TITLES.filter(t => t.isEssential)
    : MARVEL_TITLES;

  const totalTitles = relevantTitles.length;
  const watchedCount = relevantTitles.filter(t => userData.watched[t.id]).length;
  const progressPercent = totalTitles > 0 ? Math.round((watchedCount / totalTitles) * 100) : 0;

  let totalMinutes = 0;
  let watchedMinutes = 0;

  relevantTitles.forEach(t => {
    const tmdb = tmdbData[t.id];
    const runtime = tmdb?.runtime || (t.type === 'movie' ? 130 : 360);
    totalMinutes += runtime;
    if (userData.watched[t.id]) {
      watchedMinutes += runtime;
    }
  });

  const totalHours = Math.round(totalMinutes / 60);
  const watchedHours = Math.round(watchedMinutes / 60);
  const remainingHours = totalHours - watchedHours;

  const getVariantDesignation = (watched: number, total: number) => {
    if (watched === 0) return { title: "Civilian", color: "text-white/50" };
    const pct = watched / total;
    if (pct < 0.25) return { title: "TVA Analyst", color: "text-blue-400" };
    if (pct < 0.5) return { title: "Avenger Candidate", color: "text-red-400" };
    if (pct < 0.75) return { title: "Sorcerer Supreme", color: "text-yellow-400" };
    if (pct < 1) return { title: "Watcher of the Multiverse", color: "text-purple-400" };
    return { title: "He Who Remains", color: "text-marvel-red glow-red" };
  };

  const variant = getVariantDesignation(watchedCount, totalTitles);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" id="progress-dashboard">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div>
            <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 font-medium mb-1">
              Marathon Progress
            </h2>
            <div className="text-xs text-white/40 uppercase tracking-wider">
              Variant Status: <span className={`font-bold ${variant.color}`}>{variant.title}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 self-start md:self-auto">
            {/* The Snap Trigger */}
            <button
              onClick={() => {
                if (isSnapped) {
                  // Reverse Snap
                  setIsSnapped(false);
                  setSnappedTitleIds([]);
                } else {
                  // The Snap
                  // Only snap unwatched titles
                  const unwatchedIds = MARVEL_TITLES.filter(t => !userData.watched[t.id]).map(t => t.id);
                  const toSnap = unwatchedIds
                    .sort(() => Math.random() - 0.5)
                    .slice(0, Math.floor(unwatchedIds.length / 2));
                  setSnappedTitleIds(toSnap);
                  setIsSnapped(true);
                  // Dispatch custom event for cinematic flash in MediaGrid
                  if (typeof window !== 'undefined') {
                     window.dispatchEvent(new CustomEvent('thanos-snap', { detail: toSnap }));
                  }
                }
              }}
              className={`px-4 py-2 rounded-xl border transition-all ${
                isSnapped 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20' 
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20'
              }`}
            >
              {isSnapped ? '🟢 Reverse Snap' : '🧤 Snap'}
            </button>

            <div className="text-2xl md:text-3xl font-black text-white">
              {progressPercent}
              <span className="text-marvel-red text-lg">%</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-6">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, #EC1D24, #FF6B6B, #FFD700)',
              boxShadow: '0 0 20px rgba(236,29,36,0.5), 0 0 40px rgba(236,29,36,0.2)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-y-0 w-20 rounded-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            }}
            animate={{ left: ['-10%', '110%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Watched" value={watchedCount} suffix={`/ ${totalTitles}`} icon="🎬" />
          <StatCard label="Hours Done" value={watchedHours} suffix="hrs" icon="⏱" />
          <StatCard label="Remaining" value={remainingHours} suffix="hrs" icon="🚀" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, suffix, icon }: {
  label: string;
  value: number;
  suffix: string;
  icon: string;
}) {
  return (
    <div className="text-center">
      <div className="text-lg mb-1">{icon}</div>
      <motion.div
        className="text-xl md:text-2xl font-bold text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {value}
        <span className="text-xs text-white/40 ml-1 font-normal">{suffix}</span>
      </motion.div>
      <div className="text-[10px] text-white/40 tracking-[0.15em] uppercase mt-1">
        {label}
      </div>
    </div>
  );
}
