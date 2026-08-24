'use client';

"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, BookOpen, Layers, Type, Sun, Moon, Contrast } from 'lucide-react';
import Link from 'next/link';
import { generateLayout, LayoutConfig } from '@/lib/layout-engine';
import { FlipBook } from './FlipBook';
import type { Article } from '@/types';

interface ArticlePageProps {
  article: Article | any;
}

export function ArticlePage({ article }: ArticlePageProps) {
  const [viewMode, setViewMode] = useState<'scroll' | 'flip'>('scroll');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'loose'>('relaxed');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'contrast'>('light');
  const [lang, setLang] = useState<'en' | 'si'>('en');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedFontSize = localStorage.getItem('vc_fontSize') as any;
    const savedTheme = localStorage.getItem('vc_theme') as any;
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  const handleFontSizeChange = (size: 'sm' | 'base' | 'lg' | 'xl') => {
    setFontSize(size);
    localStorage.setItem('vc_fontSize', size);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'contrast') => {
    setThemeMode(theme);
    localStorage.setItem('vc_theme', theme);
  };

  const contentToRender =
    lang === 'si' && article.contentSi ? article.contentSi : article.content || article.body;

  // Auto-layout computation
  const layoutConfig: LayoutConfig = generateLayout(contentToRender, article.category);

  // Formatting html or text
  const formatBodyContent = (content: any) => {
    if (!content) return '';
    if (typeof content === 'string') {
      return content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>');
    }
    if (typeof content === 'object') {
      try {
        if (content.type === 'doc' && Array.isArray(content.content)) {
          return content.content
            .map((node: any) => {
              if (node.type === 'paragraph') {
                const text = node.content?.map((c: any) => c.text).join('') || '';
                return `<p>${text}</p>`;
              }
              if (node.type === 'heading') {
                const text = node.content?.map((c: any) => c.text).join('') || '';
                return `<h3>${text}</h3>`;
              }
              if (node.type === 'blockquote') {
                const text = node.content?.map((c: any) => c.text).join('') || '';
                return `<blockquote>${text}</blockquote>`;
              }
              return '';
            })
            .join('');
        }
      } catch (e) {}
    }
    return JSON.stringify(content);
  };

  const rawHtml = formatBodyContent(contentToRender);

  // Split content into mock pages for FlipBook
  const paragraphs = rawHtml.split(/<\/?p>/).filter((p: string) => p.trim().length > 0);
  const flipPages = paragraphs.reduce((acc: any[], para: string, idx: number) => {
    const pageIndex = Math.floor(idx / 2);
    if (!acc[pageIndex]) {
      acc[pageIndex] = {
        title: idx === 0 ? article.title : undefined,
        htmlContent: `<p>${para}</p>`,
        pageNumber: pageIndex + 1,
      };
    } else {
      acc[pageIndex].htmlContent += `<p class="mt-4">${para}</p>`;
    }
    return acc;
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const publishDate = article.publishedAt
    ? new Date(article.publishedAt.toMillis ? article.publishedAt.toMillis() : article.publishedAt)
    : new Date();

  const authorName = article.author?.name || article.authorName || 'Dr. Elara Vance';
  const authorAvatar = article.author?.avatar || article.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150';
  const authorBio = article.author?.bio || 'Lead Astrobiologist & Research Fellow at CERN';
  const imageUrl = article.imageUrl || article.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200';

  const themeClasses =
    themeMode === 'dark'
      ? 'bg-[#0E0E14] text-[#E0E0EC]'
      : themeMode === 'contrast'
      ? 'bg-black text-white'
      : 'bg-[#FDF9EC] text-[var(--color-text-primary)]';

  const fontSizeClasses =
    fontSize === 'sm'
      ? 'text-sm'
      : fontSize === 'lg'
      ? 'text-lg'
      : fontSize === 'xl'
      ? 'text-xl'
      : 'text-base';

  const lineHeightClasses =
    lineHeight === 'normal'
      ? 'leading-normal'
      : lineHeight === 'loose'
      ? 'leading-loose'
      : 'leading-relaxed';

  return (
    <div className={`min-h-screen transition-colors duration-300 font-body ${themeClasses}`}>
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 w-full glass backdrop-blur-md border-b border-[var(--color-glass-border)] py-3 px-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Magazine
          </Link>

          {/* Center: Reading & Layout Controls */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 glass rounded-full border border-[var(--color-glass-border)]">
              <button
                onClick={() => setViewMode('scroll')}
                className={`px-3 py-1 rounded-full font-sans text-xs font-bold transition-all ${
                  viewMode === 'scroll'
                    ? 'bg-[var(--color-accent-cyan)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Scroll
              </button>
              <button
                onClick={() => setViewMode('flip')}
                className={`px-3 py-1 rounded-full font-sans text-xs font-bold transition-all ${
                  viewMode === 'flip'
                    ? 'bg-[var(--color-accent-cyan)] text-white shadow-sm'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                }`}
              >
                Flip-Book
              </button>
            </div>

            {/* Language Toggle */}
            {article.contentSi && (
              <button
                onClick={() => setLang(lang === 'en' ? 'si' : 'en')}
                className="px-2.5 py-1 glass rounded-full font-sans text-xs font-bold text-[var(--color-accent-gold)] border border-[var(--color-glass-border)]"
              >
                {lang === 'en' ? 'සිංහල' : 'English'}
              </button>
            )}

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center gap-1 glass px-2 py-1 rounded-full border border-[var(--color-glass-border)]">
              <Type className="w-3.5 h-3.5 text-[var(--color-text-muted)] mr-1" />
              {(['sm', 'base', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className={`w-6 h-6 rounded-full font-sans text-xs font-bold transition-all ${
                    fontSize === size
                      ? 'bg-[var(--color-accent-cyan)] text-white'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {size.toUpperCase().slice(0, 1)}
                </button>
              ))}
            </div>

            {/* Theme Selector */}
            <div className="hidden sm:flex items-center gap-1 glass px-2 py-1 rounded-full border border-[var(--color-glass-border)]">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-1 rounded-full ${themeMode === 'light' ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-text-muted)]'}`}
                title="Light Mode"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-1 rounded-full ${themeMode === 'dark' ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-text-muted)]'}`}
                title="Dark Mode"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleThemeChange('contrast')}
                className={`p-1 rounded-full ${themeMode === 'contrast' ? 'text-[var(--color-accent-gold)]' : 'text-[var(--color-text-muted)]'}`}
                title="High Contrast"
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-full glass border border-[var(--color-glass-border)] transition-colors ${
                isBookmarked ? 'text-[var(--color-accent-cyan)]' : 'text-[var(--color-text-secondary)]'
              }`}
              title="Bookmark article"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full glass border border-[var(--color-glass-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-accent-cyan)] transition-colors"
              title="Share article"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="font-sans text-[10px] text-[var(--color-accent-cyan)] font-bold">Copied!</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main id="main-content" className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
        {viewMode === 'flip' ? (
          <FlipBook
            pages={flipPages.length > 0 ? flipPages : [{ htmlContent: rawHtml, pageNumber: 1 }]}
            title={article.title}
            author={authorName}
            coverImage={imageUrl}
          />
        ) : (
          <article className="w-full">
            {/* Header / Hero Section */}
            <header className="mb-10 text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 font-display text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--color-accent-cyan)] mb-4">
                <span className="px-2.5 py-1 rounded-full border border-[var(--color-glass-border)] glass">
                  {article.category || 'Science'}
                </span>
                <span>•</span>
                <span>{layoutConfig.template.toUpperCase()} TEMPLATE</span>
              </div>

              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
                {article.title}
              </h1>

              {article.excerpt && (
                <p className="font-body text-lg md:text-xl text-[var(--color-text-secondary)] leading-relaxed mb-8">
                  {article.excerpt}
                </p>
              )}

              {/* Author and Date Meta */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-sans text-[var(--color-text-muted)] border-y border-[var(--color-glass-border)] py-4">
                <div className="flex items-center gap-2">
                  <img src={authorAvatar} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-bold text-[var(--color-text-primary)]">{authorName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{publishDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readTime || '5 min read'}</span>
                </div>
              </div>
            </header>

            {/* Featured Image */}
            {imageUrl && (
              <div className="w-full aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-[var(--shadow-glass-lg)] border border-[var(--color-glass-border)]">
                <img src={imageUrl} alt={article.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article Body with Dynamic Auto-Layout */}
            <div
              className={`w-full max-w-3xl mx-auto ${fontSizeClasses} ${lineHeightClasses} ${
                layoutConfig.columnCount === 2 ? 'md:columns-2 md:gap-8' : ''
              }`}
            >
              {layoutConfig.enableDropCap && (
                <style jsx global>{`
                  .article-prose > p:first-of-type::first-letter {
                    font-size: 3.5rem;
                    float: left;
                    line-height: 1;
                    padding-right: 0.75rem;
                    font-family: var(--font-heading, serif);
                    color: var(--color-accent-cyan);
                    font-weight: bold;
                  }
                `}</style>
              )}

              <div
                className="article-prose space-y-6 text-[var(--color-text-secondary)]"
                dangerouslySetInnerHTML={{ __html: rawHtml }}
              />
            </div>

            {/* Author Biography Box */}
            <section className="max-w-3xl mx-auto mt-16 p-8 glass-card rounded-2xl border border-[var(--color-glass-border)] flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-[var(--color-glass-border)]"
              />
              <div>
                <span className="font-display text-[10px] font-bold tracking-widest uppercase text-[var(--color-accent-cyan)]">
                  About the Author
                </span>
                <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mt-1 mb-2">
                  {authorName}
                </h3>
                <p className="font-body text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {authorBio}
                </p>
              </div>
            </section>
          </article>
        )}
      </main>
    </div>
  );
}
