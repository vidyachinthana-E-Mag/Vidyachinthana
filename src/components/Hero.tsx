"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles, Layers, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '@/context/ThemeContext';

interface HeroProps {
  article: any;
}

export function Hero({ article }: HeroProps) {
  const { isSciFi } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  if (!article) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const authorName = article.author?.name || article.authorName || 'Dr. Elara Vance';
  const authorAvatar = article.author?.image || article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
  const imageUrl = article.featuredImage || article.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200';

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 md:px-8 my-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="liquid-glass rounded-3xl p-6 sm:p-10 relative overflow-hidden group border border-slate-200/80 dark:border-cyan-500/20"
        style={{
          background: isHovered
            ? isSciFi
              ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0, 240, 255, 0.12), rgba(8, 14, 28, 0.85) 60%)`
              : `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(37, 99, 235, 0.06), rgba(255, 255, 255, 0.85) 60%)`
            : undefined,
        }}
      >
        {/* Animated Cyber Scanline Overlay for Sci-Fi Mode */}
        <div className="cyber-scanline" />

        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-center relative z-10">
          {/* Left Column: Editorial Details */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-600/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 border border-blue-600/20 dark:border-cyan-400/30">
                <Zap size={13} className="text-blue-600 dark:text-cyan-400 animate-pulse" />
                <span>{article.category || 'Science & Thought'}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <Sparkles size={12} className="text-amber-500" />
                <span>Inaugural Transmission</span>
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] text-slate-900 dark:text-white tracking-tight">
              {article.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-body line-clamp-3">
              {article.excerpt ||
                'Topological quantum systems and biomimetic algorithms are opening unprecedented computational regimes, bridging quantum mechanics and neural synthesis.'}
            </p>

            {/* Author Capsule */}
            <div className="flex items-center gap-3.5 pt-2">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 dark:border-cyan-400 shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {authorName}
                </span>
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Fellow Researcher</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{article.readTime || '6 min read'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Read Action Capsule */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <Link
                href={`/articles/${article.slug || article.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 dark:hover:bg-cyan-300 transition-all shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-cyan-400/30 group/btn"
              >
                <span>Read Full Manuscript</span>
                <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/issues"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
              >
                <Layers size={14} />
                <span>View in Issue #001 Folio</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Hologram */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-cyan-500/30 group-hover:scale-[1.01] transition-all duration-500">
            <img
              src={imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Holographic Gradient & Corner HUD Markers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>FIG 1.0 • SPECTRAL MATRIX</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-0.5">
                Vidya Chinthana Archives
              </span>
              <p className="font-serif text-sm font-bold line-clamp-1">
                {article.title}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
