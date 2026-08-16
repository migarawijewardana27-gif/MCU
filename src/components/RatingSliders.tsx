'use client';

import { RatingData, RATING_CATEGORIES, DEFAULT_RATING } from '@/types';

interface Props {
  ratings: RatingData;
  onChange: (ratings: RatingData) => void;
}

export default function RatingSliders({ ratings, onChange }: Props) {
  const values = ratings || DEFAULT_RATING;

  const handleChange = (key: keyof RatingData, value: number) => {
    onChange({ ...values, [key]: value });
  };

  const average = RATING_CATEGORIES.reduce((sum, cat) => sum + (values[cat.key] || 0), 0) / 5;

  return (
    <div className="space-y-4" id="rating-sliders">
      {/* Average score */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-white/40 uppercase tracking-wider">Your Rating</span>
        <div className="flex items-center gap-2">
          <span
            className="text-2xl font-black text-yellow-400"
            style={{ textShadow: '0 0 15px rgba(250,204,21,0.4)' }}
          >
            {average.toFixed(1)}
          </span>
          <span className="text-xs text-white/30">/ 10</span>
        </div>
      </div>

      {/* Category sliders */}
      {RATING_CATEGORIES.map(({ key, label, icon }) => (
        <div key={key} className="group">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] text-white/60 flex items-center gap-1.5">
              <span>{icon}</span>
              {label}
            </label>
            <span
              className="text-sm font-bold text-white/80 min-w-[2rem] text-right tabular-nums"
              style={{
                color: getScoreColor(values[key] || 0),
              }}
            >
              {values[key] || 0}
            </span>
          </div>

          {/* Custom slider */}
          <div className="relative h-6 flex items-center">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={values[key] || 0}
              onChange={(e) => handleChange(key, parseFloat(e.target.value))}
              className="rating-slider w-full"
              style={{
                '--slider-progress': `${((values[key] || 0) / 10) * 100}%`,
                '--slider-color': getScoreColor(values[key] || 0),
              } as React.CSSProperties}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 8) return '#22c55e';
  if (score >= 6) return '#facc15';
  if (score >= 4) return '#f97316';
  if (score > 0) return '#ef4444';
  return 'rgba(255,255,255,0.3)';
}
