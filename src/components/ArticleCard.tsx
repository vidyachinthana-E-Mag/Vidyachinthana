"use client";
import React, { useState } from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { Article } from '@/types';
import { useTheme } from '@/context/ThemeContext';

interface ArticleCardProps {
  article: Article | any;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const { isSciFi } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const getCategoryStyles = () => {
    switch (article.category) {
      case 'SCIENCE':
      case 'Science':
        return {
          badge: 'bg-blue-500/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 border-blue-500/20 dark:border-cyan-400/30',
          dot: 'bg-blue-600 dark:bg-cyan-400',
        };
      case 'TECHNOLOGY':
      case 'Technology':
        return {
          badge: 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/20 dark:text-purple-300 border-purple-500/20 dark:border-purple-400/30',
          dot: 'bg-purple-600 dark:bg-purple-400',
        };
      case 'EDUCATION':
      case 'Education':
        return {
          badge: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/20 dark:text-emerald-300 border-emerald-500/20 dark:border-emerald-400/30',
          dot: 'bg-emerald-600 dark:bg-emerald-400',
        };
      case 'SCI_FI':
      case 'Science Fiction':
        return {
          badge: 'bg-amber-500/10 text-amber-600 dark:bg-amber-400/20 dark:text-amber-300 border-amber-500/20 dark:border-amber-400/30',
          dot: 'bg-amber-600 dark:bg-amber-400',
        };
      default:
        return {
          badge: 'bg-blue-500/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 border-blue-500/20 dark:border-cyan-400/30',
          dot: 'bg-blue-600 dark:bg-cyan-400',
        };
    }
  };

  const catStyle = getCategoryStyles();
  const href = `/articles/${article.slug || article.id}`;
  const authorAvatar = article.author?.image || article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
  const authorName = article.author?.name || article.authorName || 'Faculty Researcher';
  const imageUrl = article.imageUrl || article.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800';

  return (
    <Link
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group h-full liquid-card rounded-3xl overflow-hidden flex flex-col block border border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
        featured ? 'md:col-span-2' : ''
      }`}
      style={{
        background: isHovered
          ? isSciFi
            ? `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(0, 240, 255, 0.12), rgba(15, 23, 42, 0.75) 60%)`
            : `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(37, 99, 235, 0.05), rgba(255, 255, 255, 0.9) 60%)`
          : undefined,
      }}
    >
      {/* Cyber scanline in sci-fi dark mode */}
      <div className="cyber-scanline" />

      {/* Image Thumbnail with Shimmer */}
      <div className="w-full aspect-[16/10] overflow-hidden relative bg-slate-100 dark:bg-slate-900">
        <img
          src={imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Floating Category Pill */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border backdrop-blur-md ${catStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
            <span>{article.category}</span>
          </span>
        </div>

        {/* Read Time Tag */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono flex items-center gap-1 border border-white/10">
          <Clock size={11} />
          <span>{article.readTime || '5 min read'}</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex-1 flex flex-col p-5 sm:p-6 justify-between">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug mb-2">
            {article.title}
          </h3>

          {article.excerpt && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 font-body leading-relaxed mb-4">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-6 h-6 rounded-full object-cover border border-slate-200 dark:border-cyan-500/40"
            />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-body">
              {authorName}
            </span>
          </div>

          <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
            <span>Read</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
