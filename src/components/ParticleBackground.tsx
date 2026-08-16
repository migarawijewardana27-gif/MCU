'use client';

import { useEffect, useRef } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ambientColor } = useAppContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.1;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.4;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity += Math.sin(Date.now() * this.fadeSpeed) * 0.01;

        if (this.y < -10) {
          this.y = canvas!.height + 10;
          this.x = Math.random() * canvas!.width;
        }
        if (this.x < -10) this.x = canvas!.width + 10;
        if (this.x > canvas!.width + 10) this.x = -10;
      }

      draw(ctx: CanvasRenderingContext2D, color: string) {
        const [r, g, b] = color.split(',').map(s => parseInt(s.trim()));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(0.4, this.opacity))})`;
        ctx.fill();
      }
    }

    class Rift {
      x: number;
      y: number;
      length: number;
      angle: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.length = 50 + Math.random() * 200;
        this.angle = (Math.random() - 0.5) * Math.PI;
        this.opacity = 0;
        this.maxLife = 150 + Math.random() * 200;
        this.life = 0;
      }

      update() {
        this.life++;
        if (this.life < this.maxLife / 2) {
          this.opacity = (this.life / (this.maxLife / 2)) * 0.15;
        } else {
          this.opacity = (1 - (this.life - this.maxLife / 2) / (this.maxLife / 2)) * 0.15;
        }
      }

      draw(ctx: CanvasRenderingContext2D, color: string) {
        if (this.opacity <= 0) return;
        const [r, g, b] = color.split(',').map(s => parseInt(s.trim()));
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        
        // Zigzag rift
        let currX = this.x;
        let currY = this.y;
        const segments = 5;
        const segmentLength = this.length / segments;
        
        for (let i = 0; i < segments; i++) {
          const jitter = (Math.random() - 0.5) * 10;
          currX += Math.cos(this.angle) * segmentLength + jitter;
          currY += Math.sin(this.angle) * segmentLength + jitter;
          ctx.lineTo(currX, currY);
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${this.opacity * 2})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }

    // Initialize particles and rifts
    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    let rifts: Rift[] = [];
    const maxRifts = 3;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Randomly spawn rifts
      if (rifts.length < maxRifts && Math.random() < 0.01) {
        rifts.push(new Rift());
      }
      
      rifts = rifts.filter(r => r.life < r.maxLife);
      
      rifts.forEach(r => {
        r.update();
        r.draw(ctx, ambientColor);
      });

      particles.forEach(p => {
        p.update();
        p.draw(ctx, ambientColor);
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [ambientColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
}
