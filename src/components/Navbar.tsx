'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { THEMES, AppTheme } from '@/types';
import { motion } from 'framer-motion';
import { signOutUser } from '@/lib/firebase';
import { HelpCircle } from 'lucide-react';

export default function Navbar() {
  const { activeTheme, setActiveTheme, user, setShowOnboardingModal } = useAppContext();

  return (
    <nav className="sticky top-0 z-50 navbar-glass border-b border-white/5" id="navbar">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Marvel Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex-shrink-0">
            <img 
              src="/marvel-logo.svg" 
              alt="Marvel Tracker" 
              className="h-10 md:h-12 w-auto drop-shadow-md hover:scale-105 transition-transform" 
            />
          </Link>
          <div className="hidden md:flex gap-4 ml-4">
            <Link href="/" className="text-xs uppercase tracking-widest text-white/70 hover:text-white font-semibold transition-colors">Grid View</Link>
            <Link href="/timeline" className="text-xs uppercase tracking-widest text-white/70 hover:text-white font-semibold transition-colors">Timeline Map</Link>
          </div>
        </div>

        {/* App Title & Theme Switcher */}
        <div className="flex items-center gap-6">
          <select 
            value={activeTheme}
            onChange={(e) => setActiveTheme(e.target.value as AppTheme)}
            className="bg-black/50 border border-white/10 text-white/70 text-xs rounded-md px-2 py-1 outline-none focus:border-marvel-red"
          >
            {Object.entries(THEMES).map(([key, theme]) => (
              <option key={key} value={key}>{theme.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowOnboardingModal(true)}
            className="text-white/50 hover:text-white transition-colors"
            title="How to use this app"
          >
            <HelpCircle size={18} />
          </button>

          {/* User Profile */}
          {user && (
            <div className="hidden md:flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="flex items-center gap-2">
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" className="w-8 h-8 rounded-full border border-white/20 shadow-lg" />
              </div>
              <button 
                onClick={signOutUser} 
                className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-md"
              >
                Sign Out
              </button>
            </div>
          )}

          <div className="hidden md:flex flex-col items-end">
            <h1 className="text-sm md:text-base font-black tracking-[0.2em] text-white/90 uppercase">
              Multiverse Tracker
            </h1>
            <span className="text-[9px] tracking-[0.3em] text-marvel-red/80 uppercase font-medium">
              Road to Doomsday
            </span>
          </div>

          {/* Mobile title */}
          <div className="md:hidden text-right">
            <div className="text-[10px] tracking-[0.2em] text-white/70 uppercase font-bold">
              Multiverse
            </div>
            <div className="text-[8px] tracking-[0.2em] text-marvel-red/70 uppercase">
              Tracker
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
