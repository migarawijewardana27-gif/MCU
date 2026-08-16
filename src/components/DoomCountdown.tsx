'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const DOOMSDAY_DATE = new Date('2026-12-17T00:00:00').getTime();

export default function DoomCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, DOOMSDAY_DATE - now);
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Heartbeat audio — only plays when visible
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/heartbeat.mp3');
      audioRef.current.loop = true;
      audioRef.current.volume = 0.25;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isVisible) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isVisible]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[70vh] md:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden"
      id="doom-countdown"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001a0f] via-[#08080A] to-[#08080A]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(0,255,106,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Metallic grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px),
            repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.1) 60px, rgba(255,255,255,0.1) 61px)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-4"
        >
          <span className="text-[#7CFF7C]/60 text-xs md:text-sm tracking-[0.4em] uppercase font-medium">
            The Multiverse Converges
          </span>
        </motion.div>

        {/* Marvel Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div 
            className="inline-block bg-[#00FF6A] text-[#001a0f] font-black text-3xl md:text-5xl px-3 py-1 tracking-tighter shadow-[0_0_30px_rgba(0,255,106,0.5)]"
          >
            MARVEL
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-none mb-4"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #8A8D90 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Avengers
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-none mb-12"
          style={{
            color: '#00FF6A',
            textShadow: '0 0 40px rgba(0,255,106,0.4), 0 0 80px rgba(0,255,106,0.15)',
          }}
        >
          Doomsday
        </motion.h2>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="inline-flex items-center gap-3 md:gap-6 glass-panel rounded-2xl px-6 md:px-10 py-5 md:py-7"
        >
          <CountdownUnit value={timeLeft.days} label="Days" />
          <Separator />
          <CountdownUnit value={timeLeft.hours} label="Hours" />
          <Separator />
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <Separator />
          <CountdownUnit value={timeLeft.seconds} label="Sec" />
        </motion.div>

        {/* Date label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6"
        >
          <span className="text-[#7CFF7C]/40 text-[11px] tracking-[0.3em] uppercase font-medium">
            December 17, 2026
          </span>
        </motion.div>
      </div>

      {/* Bottom glow line */}
      <div className="absolute inset-x-0 bottom-0 h-px doom-glow-line" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08080A] to-transparent" />
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="text-3xl md:text-5xl lg:text-6xl font-black text-[#00FF6A] tabular-nums min-w-[3rem] md:min-w-[5rem] text-center"
        style={{
          textShadow: '0 0 20px rgba(0,255,106,0.5), 0 0 40px rgba(0,255,106,0.2)',
          fontFamily: "'Inter', 'SF Mono', monospace",
        }}
      >
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-[9px] md:text-[11px] text-[#7CFF7C]/40 tracking-[0.25em] uppercase font-medium mt-2">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <span
      className="text-[#00FF6A]/30 text-2xl md:text-4xl font-light"
      style={{ textShadow: '0 0 10px rgba(0,255,106,0.2)' }}
    >
      :
    </span>
  );
}
