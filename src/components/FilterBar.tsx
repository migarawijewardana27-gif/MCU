'use client';

import { useAppContext } from '@/context/AppContext';
import { FilterState } from '@/types';
import { MARVEL_TITLES } from '@/data/marvelTitles';

const ESSENTIAL_COUNT = MARVEL_TITLES.filter(t => t.isEssential).length;
const TOTAL_COUNT = MARVEL_TITLES.length;

export default function FilterBar() {
  const { filterState, setFilterState } = useAppContext();

  const update = (partial: Partial<FilterState>) => {
    setFilterState({ ...filterState, ...partial });
  };

  return (
    <div className="sticky top-[52px] md:top-[56px] z-40 filter-bar-glass border-b border-white/5" id="filter-bar">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* Row 1: Marathon toggle + Watch status */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Marathon Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 text-xs">
            <button
              onClick={() => update({ marathonMode: 'essential' })}
              className={`px-4 py-1.5 transition-all duration-300 font-semibold ${
                filterState.marathonMode === 'essential'
                  ? 'bg-marvel-red text-white shadow-lg shadow-marvel-red/30'
                  : 'bg-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              Main Storyline ({ESSENTIAL_COUNT})
            </button>
            <button
              onClick={() => update({ marathonMode: 'all' })}
              className={`px-4 py-1.5 transition-all duration-300 font-semibold ${
                filterState.marathonMode === 'all'
                  ? 'bg-marvel-red text-white shadow-lg shadow-marvel-red/30'
                  : 'bg-white/5 text-white/50 hover:text-white/80'
              }`}
            >
              Multiverse Madness ({TOTAL_COUNT})
            </button>
          </div>

          {/* Watch Status Segmented Control */}
          <div className="flex rounded-xl overflow-hidden border border-white/10 text-xs">
            {(['all', 'unwatched', 'watched'] as const).map((status) => (
              <button
                key={status}
                onClick={() => update({ watchStatus: status })}
                className={`px-3 py-1.5 capitalize transition-all duration-300 ${
                  filterState.watchStatus === status
                    ? 'bg-white/15 text-white'
                    : 'bg-white/5 text-white/40 hover:text-white/70'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Category Tags */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {[
            { key: 'all' as const, label: 'All', icon: '🌟' },
            { key: 'movies' as const, label: 'Movies', icon: '🎬' },
            { key: 'tv' as const, label: 'TV Series', icon: '📺' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => update({ category: key })}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all duration-300 border ${
                filterState.category === key
                  ? 'bg-marvel-red/20 border-marvel-red/50 text-white shadow-sm shadow-marvel-red/20'
                  : 'bg-white/5 border-white/5 text-white/40 hover:text-white/70 hover:border-white/15'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
