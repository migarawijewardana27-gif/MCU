'use client';

import React from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { motion } from 'framer-motion';
import { useAppContext } from '@/context/AppContext';
import { TIMELINE_NODES, TIMELINE_EDGES, TimelineNode } from '@/data/timelineData';
import { getPosterUrl } from '@/lib/tmdb';
import DetailModal from './DetailModal';
import ParticleBackground from './ParticleBackground';

export default function TimelineMap() {
  const { userData, tmdbData, setSelectedTitle } = useAppContext();
  
  // Calculate dynamic bounds based on nodes
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  TIMELINE_NODES.forEach(n => {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.y > maxY) maxY = n.y;
  });

  // Add generous padding around the content
  const PADDING_X = 1000;
  const PADDING_Y = 1000;
  
  const originX = -minX + PADDING_X; // Shift origin so the leftmost node is at PADDING_X
  const originY = -minY + PADDING_Y;
  
  const canvasWidth = (maxX - minX) + (PADDING_X * 2);
  const canvasHeight = (maxY - minY) + (PADDING_Y * 2);

  const handleNodeClick = (node: TimelineNode) => {
    setSelectedTitle(node.title);
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case 'core': return '#EC1D24'; // Marvel Red
      case 'cosmic': return '#8B5CF6'; // Purple
      case 'street': return '#F59E0B'; // Amber/Gold
      case 'magic': return '#10B981'; // Emerald Green
      case 'fox': return '#3B82F6'; // Blue
      case 'sony': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#08080A] relative" id="timeline-map">
      
      {/* Legend & Controls overlay */}
      <div className="absolute top-20 left-6 z-20 glass-panel p-4 rounded-xl flex flex-col gap-3 backdrop-blur-xl border-white/10">
        <h2 className="text-sm font-black tracking-widest uppercase text-white/90">Multiverse Map</h2>
        <div className="flex flex-col gap-2">
          {['core (MCU)', 'cosmic', 'street level', 'magic', 'fox x-men', 'sony'].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full shadow-[0_0_15px_currentColor] animate-pulse" style={{ backgroundColor: getTrackColor(t.split(' ')[0]), color: getTrackColor(t.split(' ')[0]) }} />
              <span className="text-[10px] uppercase tracking-wider text-white/60">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 glass-panel p-4 rounded-xl backdrop-blur-xl border-white/10 text-right">
        <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">Navigation</div>
        <div className="text-xs text-white/80">Drag to Pan</div>
      </div>

      {/* Main Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-50">
        <ParticleBackground />
      </div>

      <TransformWrapper
        initialScale={0.8}
        initialPositionX={-originX + (typeof window !== 'undefined' ? window.innerWidth / 2 : 500)}
        initialPositionY={-originY + (typeof window !== 'undefined' ? window.innerHeight / 2 : 500)}
        minScale={0.8}
        maxScale={0.8}
        limitToBounds={true}
        wheel={{ disabled: true }}
        pinch={{ disabled: true }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <div 
            style={{ 
              width: canvasWidth, 
              height: canvasHeight, 
              position: 'relative',
              // Add a subtle grid background
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          >
            {/* SVG Edges Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              {TIMELINE_EDGES.map(edge => {
                const source = TIMELINE_NODES.find(n => n.id === edge.source);
                const target = TIMELINE_NODES.find(n => n.id === edge.target);
                if (!source || !target) return null;

                const sx = originX + source.x;
                const sy = originY + source.y;
                const tx = originX + target.x;
                const ty = originY + target.y;

                const color = edge.type === 'crossover' ? 'rgba(255,255,255,0.3)' : getTrackColor(source.track);
                const isDashed = edge.type === 'crossover';
                
                // Both nodes watched = solid glow. Else = dim.
                const sWatched = userData.watched[source.id];
                const tWatched = userData.watched[target.id];
                const isActive = sWatched && tWatched;

                return (
                  <g key={edge.id}>
                    {/* Base dim line */}
                    <path
                      d={`M ${sx} ${sy} C ${sx + (tx - sx) / 2} ${sy}, ${sx + (tx - sx) / 2} ${ty}, ${tx} ${ty}`}
                      fill="transparent"
                      stroke={color}
                      strokeWidth={1}
                      opacity={0.1}
                    />
                    {/* Glowing active line */}
                    {isActive && (
                      <motion.path
                        d={`M ${sx} ${sy} C ${sx + (tx - sx) / 2} ${sy}, ${sx + (tx - sx) / 2} ${ty}, ${tx} ${ty}`}
                        fill="transparent"
                        stroke={color}
                        strokeWidth={isDashed ? 2 : 3}
                        opacity={0.8}
                        strokeDasharray={isDashed ? "10,10" : "15,15"}
                        filter="url(#glow)"
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes Layer */}
            {TIMELINE_NODES.map((node, i) => {
              const nx = originX + node.x;
              const ny = originY + node.y;
              const isWatched = userData.watched[node.id];
              const tmdb = tmdbData[node.id];
              const posterUrl = tmdb ? getPosterUrl(tmdb.posterPath, 'w200') : '';
              const trackColor = getTrackColor(node.track);

              return (
                <motion.div
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer"
                  style={{ left: nx, top: ny, zIndex: isWatched ? 20 : 10 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.01, 1), type: 'spring' }}
                  onClick={() => handleNodeClick(node)}
                >
                  {/* Magical node backdrop glow */}
                  {isWatched && (
                     <div 
                       className="absolute inset-0 rounded-full blur-xl opacity-60 pointer-events-none mix-blend-screen scale-150 animate-pulse"
                       style={{ backgroundColor: trackColor }}
                     />
                  )}

                  <div 
                    className={`relative w-20 h-28 md:w-24 md:h-36 rounded-lg overflow-hidden transition-all duration-300 border-2 ${
                      isWatched ? 'grayscale-0' : 'grayscale brightness-[0.3]'
                    } group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-[1.15] group-hover:z-50`}
                    style={{
                      borderColor: isWatched ? trackColor : 'rgba(255,255,255,0.1)',
                      boxShadow: isWatched ? `0 0 30px ${trackColor}80, inset 0 0 20px ${trackColor}40` : 'none'
                    }}
                  >
                    {posterUrl ? (
                      <img src={posterUrl} alt={node.title.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-black/50 flex items-center justify-center">
                        <span className="text-xs opacity-50 text-white text-center px-1 leading-tight">{node.title.title}</span>
                      </div>
                    )}

                    {isWatched && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)] border border-black/50">
                        <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Node label */}
                  <div className="mt-2 text-center transition-opacity opacity-0 group-hover:opacity-100 absolute top-full pt-2 w-48 pointer-events-none z-50">
                    <div className="bg-black/90 backdrop-blur border border-white/10 p-2 rounded-lg shadow-xl">
                      <div className="text-xs font-bold text-white truncate">{node.title.title} {node.title.season ? `S${node.title.season}` : ''}</div>
                      <div className="text-[10px] text-white/50">{node.title.releaseYear} • {node.track.toUpperCase()}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </TransformComponent>
      </TransformWrapper>
      
      <DetailModal />
    </div>
  );
}
