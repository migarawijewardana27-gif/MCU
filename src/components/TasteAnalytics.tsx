'use client';

import { useAppContext } from '@/context/AppContext';
import { RATING_CATEGORIES } from '@/types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function TasteAnalytics() {
  const { userData } = useAppContext();

  // Aggregate ratings
  const ratings = Object.values(userData.ratings || {});
  
  if (ratings.length === 0) {
    return null; // Don't show if no ratings
  }

  const averages = RATING_CATEGORIES.map(cat => {
    const sum = ratings.reduce((acc, r) => acc + (r[cat.key] || 0), 0);
    const avg = sum / ratings.length;
    return {
      subject: cat.label.split(' & ')[0], // Shorten label for chart
      A: avg || 0,
      fullMark: 10,
    };
  });

  // Calculate highest and lowest rated category
  const sorted = [...averages].sort((a, b) => b.A - a.A);
  const highest = sorted[0];
  const lowest = sorted[sorted.length - 1];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" id="taste-analytics">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 font-medium mb-6">
          Your MCU DNA
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="glass-panel-solid p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Top Priority</div>
              <div className="text-xl font-bold text-marvel-red">{highest.subject}</div>
              <div className="text-xs text-white/50 mt-1">You value this the most in Marvel content.</div>
            </div>
            <div className="glass-panel-solid p-4 rounded-xl border border-white/5">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Least Cared About</div>
              <div className="text-lg font-bold text-white/70">{lowest.subject}</div>
            </div>
            <div className="text-[10px] text-white/30 uppercase tracking-widest mt-4">
              Based on {ratings.length} rated titles
            </div>
          </div>

          <div className="md:col-span-2 h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={averages}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar
                  name="MCU DNA"
                  dataKey="A"
                  stroke="#EC1D24"
                  fill="#EC1D24"
                  fillOpacity={0.3}
                  strokeWidth={2}
                  isAnimationActive={true}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
}
