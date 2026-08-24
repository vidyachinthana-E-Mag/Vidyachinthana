"use client";
import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates for interactive physics
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
      }
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particle nodes for physics constellation
    const particleCount = isDark ? 65 : 40;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      baseAlpha: number;
      alpha: number;
      pulseSpeed: number;
      pulsePhase: number;
    }> = [];

    const darkColors = ['#00F0FF', '#7000FF', '#00FFA3', '#3B82F6', '#F59E0B'];
    const lightColors = ['#3B82F6', '#8B5CF6', '#06B6D4', '#6366F1'];

    for (let i = 0; i < particleCount; i++) {
      const palette = isDark ? darkColors : lightColors;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (isDark ? 0.6 : 0.35),
        vy: (Math.random() - 0.5) * (isDark ? 0.6 : 0.35),
        size: Math.random() * (isDark ? 2.2 : 3.5) + (isDark ? 1 : 1.5),
        color: palette[Math.floor(Math.random() * palette.length)],
        baseAlpha: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.4 + 0.15,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid or gradient glow backdrop in dark mode
      if (isDark) {
        // Sci-Fi grid lines (subtle)
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.018)';
        ctx.lineWidth = 1;
        const gridSize = 80;
        const offsetX = (frame * 0.1) % gridSize;
        const offsetY = (frame * 0.1) % gridSize;

        for (let x = offsetX; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = offsetY; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundaries
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Interactive mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 3;
          p.y -= Math.sin(angle) * force * 3;
        }

        // Pulsing glow
        p.pulsePhase += p.pulseSpeed;
        const pulse = Math.sin(p.pulsePhase) * 0.2;
        p.alpha = Math.max(0.08, p.baseAlpha + pulse);

        // Draw particle node
        ctx.save();
        ctx.globalAlpha = isDark ? p.alpha : p.alpha * 0.55;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Glowing outer halo for sci-fi dark
        if (isDark) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Connect nearby nodes with laser lines in dark mode, soft threads in light mode
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distNodes = Math.hypot(p.x - p2.x, p.y - p2.y);
          const maxDist = isDark ? 130 : 90;

          if (distNodes < maxDist) {
            const lineAlpha = (1 - distNodes / maxDist) * (isDark ? 0.22 : 0.08);
            ctx.save();
            ctx.globalAlpha = lineAlpha;
            ctx.strokeStyle = isDark ? '#00F0FF' : '#3B82F6';
            ctx.lineWidth = isDark ? 0.8 : 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Ambient Gradient Orbs */}
      {isDark ? (
        <>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[130px] animate-pulse" />
          <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-purple-600/10 blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '4s' }} />
        </>
      ) : (
        <>
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-400/8 blur-[120px]" />
          <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-indigo-400/8 blur-[130px]" />
          <div className="absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full bg-sky-300/8 blur-[140px]" />
        </>
      )}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />
    </div>
  );
}
