'use client';

import { useAppContext } from '@/context/AppContext';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { motion } from 'framer-motion';

export default function Achievements() {
  const { userData } = useAppContext();
  const unlocked = userData.unlockedBadges || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6" id="achievements">
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h2 className="text-sm tracking-[0.2em] uppercase text-white/60 font-medium mb-4 flex justify-between items-end">
          <span>Multiverse Badges</span>
          <span className="text-[10px] text-white/30">{unlocked.length} / {ACHIEVEMENTS.length} Unlocked</span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isUnlocked = unlocked.includes(achievement.id);
            return (
              <motion.div
                key={achievement.id}
                className={`relative p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-500 ${
                  isUnlocked 
                    ? 'glass-panel-solid border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.15)]' 
                    : 'bg-white/5 border-white/5 opacity-50 grayscale'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isUnlocked ? 1 : 0.5, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
              >
                <div className="text-3xl mb-2 filter drop-shadow-md">
                  {achievement.icon}
                </div>
                <h3 className="text-[10px] font-bold text-white uppercase tracking-wider mb-1 leading-tight">
                  {achievement.name}
                </h3>
                <p className="text-[9px] text-white/40 leading-tight">
                  {achievement.description}
                </p>

                {isUnlocked && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-[#08080A] shadow-md">
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
