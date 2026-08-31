'use client';

import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { THEMES, AppTheme } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithGoogle, signOutUser, isFirebaseConfigured } from '@/lib/firebase';
import { HelpCircle, Shield, ShieldCheck, Eye, EyeOff, Cloud, CloudOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const { activeTheme, setActiveTheme, user, userData, setShowOnboardingModal, setHideEmail } = useAppContext();
  const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
  const [showSyncMenu, setShowSyncMenu] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const privacyRef = useRef<HTMLDivElement>(null);
  const syncRef = useRef<HTMLDivElement>(null);

  const isHidden = userData.hideEmail ?? false;

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (privacyRef.current && !privacyRef.current.contains(e.target as Node)) {
        setShowPrivacyMenu(false);
      }
      if (syncRef.current && !syncRef.current.contains(e.target as Node)) {
        setShowSyncMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await signInWithGoogle();
      setShowSyncMenu(false);
    } catch (error) {
      console.error('Sync login failed:', error);
    } finally {
      setSyncLoading(false);
    }
  };

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

          {/* Cloud Sync / User Profile Section */}
          <div className="hidden md:flex items-center gap-3 border-l border-white/10 pl-6">
            {user ? (
              <>
                {/* Signed in — Avatar + Privacy + Sign Out */}
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
                  {/* Synced indicator */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#08080A]" title="Synced to cloud" />
                </div>

                {/* Privacy Toggle */}
                <div className="relative" ref={privacyRef}>
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
                            Your email is never shared or displayed to others.
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
              </>
            ) : (
              <>
                {/* Not signed in — show optional cloud sync */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800 border border-white/20 shadow-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs">M</span>
                </div>

                {isFirebaseConfigured() && (
                  <div className="relative" ref={syncRef}>
                    <button
                      onClick={() => setShowSyncMenu(!showSyncMenu)}
                      className="p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                      title="Sync progress to cloud"
                    >
                      <CloudOff size={16} />
                    </button>

                    <AnimatePresence>
                      {showSyncMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-72 bg-[#141418]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Cloud size={14} className="text-blue-400" />
                              <div className="text-xs font-bold text-white/80 uppercase tracking-wider">Cloud Sync</div>
                            </div>
                            <p className="text-[11px] text-white/40 leading-relaxed mb-3">
                              Your progress is saved locally on this device. Sign in with Google to sync across all your devices.
                            </p>
                            <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-2.5 mb-3">
                              <Shield size={12} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                              <p className="text-[10px] text-emerald-400/70 leading-relaxed">
                                Your email is never displayed or shared. We only use it to save your watch progress.
                              </p>
                            </div>
                            <button
                              onClick={handleSync}
                              disabled={syncLoading}
                              className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-60"
                            >
                              {syncLoading ? (
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                              ) : (
                                <>
                                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                  </svg>
                                  <span>Enable Cloud Sync</span>
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>

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
