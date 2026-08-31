'use client';

import { motion } from 'framer-motion';
import { signInWithGoogle, isFirebaseConfigured } from '@/lib/firebase';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const isConfigured = isFirebaseConfigured();

  const handleLogin = async () => {
    if (!isConfigured) return;
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080A] overflow-hidden">
      {/* Background Image & Effects */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg"
          alt="Marvel Background"
          className="w-full h-full object-cover opacity-30 ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-[#08080A]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080A] via-transparent to-[#08080A]" />
        
        {/* Glowing orb effect */}
        <div 
          className="absolute inset-0 opacity-40 transition-all duration-700 mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 50% 40%, rgba(236, 29, 36, 0.4) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md p-8 md:p-12 mx-4 glass-panel rounded-3xl text-center"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(236, 29, 36, 0.15)',
        }}
      >
        <div className="mb-8">
          <img 
            src="/marvel-logo.svg" 
            alt="Marvel Tracker" 
            className="h-14 mx-auto mb-6 drop-shadow-2xl" 
          />
          <h1 className="text-2xl font-black text-white tracking-[0.15em] uppercase mb-2">
            Multiverse Tracker
          </h1>
          <p className="text-sm text-white/50 tracking-wider">
            Your personal journey to Avengers: Doomsday
          </p>
        </div>

        {isConfigured ? (
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full relative group overflow-hidden rounded-xl bg-white text-black font-bold uppercase tracking-wider py-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ) : (
          <div className="w-full rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
            <h3 className="text-sm font-bold text-red-400 mb-1 uppercase tracking-wider">Setup Required</h3>
            <p className="text-xs text-white/70">
              Please add your Firebase config variables to <code>.env.local</code> to enable authentication.
            </p>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2.5 bg-white/[0.03] border border-white/5 rounded-xl p-3 text-left">
          <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>
            <p className="text-[11px] text-white/50 leading-relaxed">
              <span className="text-emerald-400/80 font-semibold">Your email stays private.</span>{' '}
              We only use Google for sign-in — your email is never displayed or shared. You can also hide your identity after signing in.
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-white/30 leading-relaxed max-w-[280px] mx-auto">
          Sign in to save your progress, track your watch history, and sync across all your devices.
        </p>
      </motion.div>
    </div>
  );
}
