'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { THEMES, AppTheme } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { signOutUser } from '@/lib/firebase';
import { HelpCircle, Shield, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { activeTheme, setActiveTheme, user, userData, setShowOnboardingModal, setHideEmail } = useAppContext();
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHidden = userData.hideEmail ?? false;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPrivacyMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
            <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6">
              {/* Avatar - respects hideEmail */}
              <div className="relative">
                {isHidden ? (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 border border-white/20 shadow-lg flex items-center justify-center">
                    <span className="text-white font-black text-xs">M</span>
                  </div>
                ) : (
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=ec1d24&color=fff`} 
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-white/20 shadow-lg" 
                  />
                )}
              </div>

              {/* Privacy Toggle */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
                  className={`p-1.5 rounded-md transition-all ${
                    isHidden 
                      ? 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20' 
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                  title={isHidden ? 'Privacy: Email Hidden' : 'Privacy: Email Visible'}
                >
                  {isHidden ? <ShieldCheck size={16} /> : <Shield size={16} />}
                </button>

                <AnimatePresence>
                  {showPrivacyMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-[#141418]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                    >
                      <div className="p-3 border-b border-white/5">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-white/40 font-bold mb-1">Privacy Settings</div>
                        <p className="text-[10px] text-white/30 leading-relaxed">
                          We only use Google to sign you in. Your email is never shared.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setHideEmail(!isHidden);
                          setShowPrivacyMenu(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 hover:bg-white/5 transition-colors group"
                      >
                        <div className={`p-1.5 rounded-lg transition-colors ${
                          isHidden ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/40'
                        }`}>
                          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-white/80 font-medium">
                            {isHidden ? 'Email Hidden' : 'Email Visible'}
                          </div>
                          <div className="text-[10px] text-white/30">
                            {isHidden ? 'Using anonymous avatar' : 'Showing Google profile photo'}
                          </div>
                        </div>
                        <div className={`w-8 h-[18px] rounded-full transition-colors relative ${
                          isHidden ? 'bg-emerald-500' : 'bg-white/15'
                        }`}>
                          <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow-sm transition-all ${
                            isHidden ? 'left-[14px]' : 'left-[2px]'
                          }`} />
                        </div>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
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

