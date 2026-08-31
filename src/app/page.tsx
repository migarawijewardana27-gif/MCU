'use client';

import { useState, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import MarvelIntroLoader from '@/components/MarvelIntroLoader';
import DoomCountdown from '@/components/DoomCountdown';
import Navbar from '@/components/Navbar';
import ProgressDashboard from '@/components/ProgressDashboard';
import Achievements from '@/components/Achievements';
import TasteAnalytics from '@/components/TasteAnalytics';
import MilestoneCovers from '@/components/MilestoneCovers';
import SideQuestRandomizer from '@/components/SideQuestRandomizer';
import FilterBar from '@/components/FilterBar';
import MediaGrid from '@/components/MediaGrid';
import DetailModal from '@/components/DetailModal';
import ParticleBackground from '@/components/ParticleBackground';
import OnboardingModal from '@/components/OnboardingModal';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);
  const { ambientColor, authLoading } = useAppContext();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#08080A]">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      {/* Intro Loader */}
      <MarvelIntroLoader onComplete={handleIntroComplete} />

      {/* Ambient Background */}
      <div
        className="fixed inset-0 z-0 ambient-bg transition-all duration-1500"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(${ambientColor}, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, rgba(${ambientColor}, 0.04) 0%, transparent 40%),
            #08080A
          `,
        }}
      />

      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Content */}
      {introComplete && (
        <div className="relative z-10">
          {/* Hero: Doomsday Countdown */}
          <DoomCountdown />

          {/* Sticky nav + filters */}
          <Navbar />

          <main>
            <ProgressDashboard />
            <Achievements />
            <TasteAnalytics />
            <MilestoneCovers />
            <SideQuestRandomizer />
            <FilterBar />
            <MediaGrid />
          </main>

          {/* Footer */}
          <footer className="max-w-7xl mx-auto px-4 py-8 text-center border-t border-white/5 mt-8">
            <p className="text-[10px] text-white/20 tracking-wider uppercase">
              Marvel Multiverse Tracker • Not affiliated with Marvel Entertainment
            </p>
          </footer>
        </div>
      )}

      {/* Detail Modal */}
      <DetailModal />

      {/* Onboarding Modal */}
      <OnboardingModal />
    </>
  );
}
