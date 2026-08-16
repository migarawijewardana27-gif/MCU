'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { Play, Star, Map, Shield, X, Film } from 'lucide-react';
import { useState } from 'react';

export default function OnboardingModal() {
  const { showOnboardingModal, completeOnboarding } = useAppContext();
  const [step, setStep] = useState(0);

  if (!showOnboardingModal) return null;

  const slides = [
    {
      title: 'Welcome to the Multiverse',
      description: 'The ultimate tracker for your Marvel Cinematic Universe journey, leading all the way up to Avengers: Doomsday.',
      icon: <Film className="w-16 h-16 text-marvel-red drop-shadow-[0_0_15px_rgba(236,29,36,0.5)]" />,
      image: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'
    },
    {
      title: 'Track & Stream',
      description: 'Click any movie or TV show to see details, watch trailers, and instantly stream it via CineHD with the "Play Now" button.',
      icon: <Play className="w-16 h-16 text-purple-500 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />,
      image: 'https://image.tmdb.org/t/p/original/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg'
    },
    {
      title: 'Rate Your Journey',
      description: 'Mark titles as watched and rate them across 5 dimensions: Story, Visuals, Characters, Multiverse Relevance, and Fun Factor.',
      icon: <Star className="w-16 h-16 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />,
      image: 'https://image.tmdb.org/t/p/original/8s4h9friP6Ci3adZIahf294zWmV.jpg'
    },
    {
      title: 'Explore the Timeline',
      description: 'Unlock achievements by completing watch phases and dive into the interactive Timeline Map to see how everything connects.',
      icon: <Map className="w-16 h-16 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />,
      image: 'https://image.tmdb.org/t/p/original/kaIfm5ryEOwYg8mLbq8HkPuM1Fo.jpg'
    }
  ];

  const nextStep = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => completeOnboarding()}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-[#08080A] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(236,29,36,0.15)] flex flex-col md:flex-row"
        >
          {/* Close Button */}
          <button 
            onClick={() => completeOnboarding()}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-2/5 h-48 md:h-auto relative overflow-hidden bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={step}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                src={slides[step].image}
                alt={slides[step].title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#08080A] via-transparent to-transparent opacity-90" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 hidden md:flex">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  {slides[step].icon}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-3/5 p-8 md:p-10 flex flex-col justify-between relative z-10">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-[10px] text-marvel-red font-bold uppercase tracking-widest mb-2">
                    Step {step + 1} of {slides.length}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-4">
                    {slides[step].title}
                  </h2>
                  <p className="text-white/70 leading-relaxed text-sm">
                    {slides[step].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-10">
              <div className="flex gap-2 mb-6">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? 'w-8 bg-marvel-red' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 italic flex items-center gap-1">
                  <Shield size={12} className="text-white/20" />
                  Wakanda Forever
                </div>
                <button
                  onClick={nextStep}
                  className="bg-white text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-transform"
                >
                  {step === slides.length - 1 ? "Let's Go!" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
