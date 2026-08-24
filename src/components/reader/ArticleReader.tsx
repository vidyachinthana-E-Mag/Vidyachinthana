"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { generateLayout, LayoutConfig } from '@/lib/layout-engine';
import { ReadingControls, FontSizeOption, ReadingThemeOption, ReadingModeOption, LanguageOption } from './ReadingControls';
import { Article } from '@/types';
import {
  Clock,
  Calendar,
  User as UserIcon,
  Share2,
  Bookmark,
  MessageSquare,
  ChevronRight,
  List,
  Sparkles,
  Send
} from 'lucide-react';

const DynamicFlipBook = dynamic(() => import('./FlipBook'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-4xl h-[600px] flex items-center justify-center bg-stone-100 dark:bg-zinc-800 rounded-2xl animate-pulse">
      <p className="text-stone-500 font-mono text-sm">Binding Digital Magazine Folio...</p>
    </div>
  ),
});

interface ArticleReaderProps {
  article: Article;
  initialComments?: any[];
}

export function ArticleReader({ article, initialComments = [] }: ArticleReaderProps) {
  const { data: session } = useSession();
  const [fontSize, setFontSize] = useState<FontSizeOption>('md');
  const [theme, setTheme] = useState<ReadingThemeOption>('paper');
  const [mode, setMode] = useState<ReadingModeOption>('scroll');
  const [lang, setLang] = useState<LanguageOption>('en');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [comments, setComments] = useState<any[]>(initialComments);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const layout: LayoutConfig = generateLayout(article);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync preferences to localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem('vc_fontSize') as FontSizeOption;
    const savedTheme = localStorage.getItem('vc_theme') as ReadingThemeOption;
    const savedLang = localStorage.getItem('vc_lang') as LanguageOption;
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, []);

  const handleSetFontSize = (size: FontSizeOption) => {
    setFontSize(size);
    localStorage.setItem('vc_fontSize', size);
  };

  const handleSetTheme = (newTheme: ReadingThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem('vc_theme', newTheme);
  };

  const handleSetLang = (newLang: LanguageOption) => {
    setLang(newLang);
    localStorage.setItem('vc_lang', newLang);
  };

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: commentText })
      });
      if (res.ok) {
        const newC = await res.json();
        setComments((prev) => [newC, ...prev]);
        setCommentText('');
      } else {
        // Fallback local update for demonstration
        setComments((prev) => [
          {
            id: 'c_' + Date.now(),
            content: commentText,
            createdAt: new Date().toISOString(),
            user: { name: session?.user?.name || 'Reader', image: session?.user?.image }
          },
          ...prev
        ]);
        setCommentText('');
      }
    } catch {
      setComments((prev) => [
        {
          id: 'c_' + Date.now(),
          content: commentText,
          createdAt: new Date().toISOString(),
          user: { name: session?.user?.name || 'Reader', image: session?.user?.image }
        },
        ...prev
      ]);
      setCommentText('');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Determine content according to selected language
  const activeContent = lang === 'si' && article.contentSi ? article.contentSi : article.content;

  // Render prose blocks
  const renderTipTapBlocks = (contentDoc: any) => {
    if (!contentDoc) return <p>Content not available in this language yet.</p>;

    if (typeof contentDoc === 'string') {
      try {
        contentDoc = JSON.parse(contentDoc);
      } catch {
        return <p className="leading-relaxed whitespace-pre-wrap">{contentDoc}</p>;
      }
    }

    if (!contentDoc.content || !Array.isArray(contentDoc.content)) {
      return <p className="leading-relaxed">{String(contentDoc)}</p>;
    }

    return contentDoc.content.map((block: any, idx: number) => {
      if (block.type === 'heading') {
        const HeadingTag = block.attrs?.level === 1 ? 'h2' : block.attrs?.level === 2 ? 'h2' : 'h3';
        const text = block.content?.map((c: any) => c.text).join('') || '';
        return (
          <HeadingTag
            key={idx}
            id={`section-${idx}`}
            className="font-serif font-bold text-2xl sm:text-3xl text-[var(--color-text-primary)] mt-8 mb-4 border-b border-black/10 pb-2 scroll-mt-24"
          >
            {text}
          </HeadingTag>
        );
      }

      if (block.type === 'blockquote') {
        const text = block.content?.[0]?.content?.map((c: any) => c.text).join('') || '';
        return (
          <blockquote
            key={idx}
            className="my-8 p-6 border-l-4 rounded-r-xl bg-black/5 dark:bg-white/5 font-serif italic text-lg sm:text-xl leading-relaxed text-[var(--color-text-primary)]"
            style={{ borderLeftColor: layout.accentColor }}
          >
            {text}
          </blockquote>
        );
      }

      if (block.type === 'bulletList') {
        return (
          <ul key={idx} className="list-disc pl-6 my-4 space-y-2">
            {block.content?.map((item: any, iIdx: number) => (
              <li key={iIdx} className="leading-relaxed">
                {item.content?.map((p: any) => p.content?.map((c: any) => c.text).join('')).join('')}
              </li>
            ))}
          </ul>
        );
      }

      if (block.type === 'orderedList') {
        return (
          <ol key={idx} className="list-decimal pl-6 my-4 space-y-2">
            {block.content?.map((item: any, iIdx: number) => (
              <li key={iIdx} className="leading-relaxed">
                {item.content?.map((p: any) => p.content?.map((c: any) => c.text).join('')).join('')}
              </li>
            ))}
          </ol>
        );
      }

      // Paragraph with Drop-Cap on first paragraph if enabled
      const paragraphText = block.content?.map((c: any) => c.text).join('') || '';
      const isFirstParagraph = idx === 0;

      return (
        <p
          key={idx}
          className={`my-4 leading-relaxed text-justify ${
            isFirstParagraph && layout.enableDropCap
              ? 'first-letter:text-6xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-blue-600'
              : ''
          }`}
        >
          {paragraphText}
        </p>
      );
    });
  };

  // Font size classes
  const fontClass =
    fontSize === 'xs'
      ? 'text-sm'
      : fontSize === 'sm'
      ? 'text-base'
      : fontSize === 'lg'
      ? 'text-xl'
      : 'text-lg';

  // Theme styling wrappers
  const themeClass =
    theme === 'paper'
      ? 'bg-[#FDF9EC] text-[#1D1D1F]'
      : theme === 'sepia'
      ? 'bg-[#F4ECD8] text-[#3D3028]'
      : theme === 'dark'
      ? 'bg-[#101014] text-[#E0E0E6]'
      : 'bg-white text-gray-900';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClass}`}>
      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 z-50 transition-all duration-100 ease-out"
        style={{
          width: `${scrollProgress}%`,
          backgroundColor: layout.accentColor,
        }}
      />

      {/* Floating Reading Preferences Bar */}
      <ReadingControls
        fontSize={fontSize}
        setFontSize={handleSetFontSize}
        theme={theme}
        setTheme={handleSetTheme}
        mode={mode}
        setMode={setMode}
        lang={lang}
        setLang={handleSetLang}
        onShare={handleShare}
      />

      {/* Mode View Switch */}
      {mode === 'flip' ? (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <DynamicFlipBook article={article} lang={lang} />
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Article Header & Editorial Meta */}
          <header className="mb-10 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span
                className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest rounded-full text-white"
                style={{ backgroundColor: layout.accentColor }}
              >
                {article.category || 'SCIENCE'}
              </span>
              <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                Template: {layout.template}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight tracking-tight mb-6">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="font-serif italic text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                "{article.excerpt}"
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-6 py-4 border-y border-black/10 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                {article.author?.image ? (
                  <img
                    src={article.author.image}
                    alt={article.author.name || 'Author'}
                    className="w-8 h-8 rounded-full object-cover border border-black/10"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                )}
                <span className="font-semibold text-gray-900 dark:text-gray-200">
                  {article.author?.name || 'Editorial Fellow'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>{article.readTime || '6 min read'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar size={14} />
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Recent Publication'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                title="Copy Article Link"
              >
                <Share2 size={14} />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </header>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-xl border border-black/10 dark:border-white/10">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-[320px] sm:h-[480px] object-cover"
              />
              <div className="p-3 bg-black/5 dark:bg-white/5 text-xs text-gray-500 font-mono flex items-center justify-between">
                <span>Figure 1.0 — High-resolution spectral visualization</span>
                <span>Vidya Chinthana Archives</span>
              </div>
            </div>
          )}

          {/* Main Reading Canvas with Auto-Layout Grid */}
          <div
            className={`grid grid-cols-1 ${
              layout.tableOfContents ? 'lg:grid-cols-[1fr_260px]' : ''
            } gap-10`}
          >
            {/* Article Body */}
            <article
              className={`prose max-w-none ${fontClass} font-body leading-relaxed ${
                layout.columnCount === 2 ? 'md:columns-2 md:gap-8' : ''
              }`}
            >
              {renderTipTapBlocks(activeContent)}
            </article>

            {/* Table of Contents / Sidebar if enabled by layout engine */}
            {layout.tableOfContents && (
              <aside className="hidden lg:block sticky top-24 h-fit p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <h3 className="font-mono text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                  <List size={14} style={{ color: layout.accentColor }} />
                  Table of Contents
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400">
                  <li className="hover:text-blue-600 transition-colors">
                    <a href="#section-1" className="line-clamp-1">1. Experimental Framework</a>
                  </li>
                  <li className="hover:text-blue-600 transition-colors">
                    <a href="#section-3" className="line-clamp-1">2. Quantitative Discoveries</a>
                  </li>
                  <li className="hover:text-blue-600 transition-colors">
                    <a href="#section-5" className="line-clamp-1">3. Implications for Policy</a>
                  </li>
                </ul>

                <div className="mt-8 pt-4 border-t border-black/10 dark:border-white/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                    <Sparkles size={14} />
                    <span>Academic Peer-Reviewed</span>
                  </div>
                </div>
              </aside>
            )}
          </div>

          {/* Discussion & Comments Section */}
          <section className="mt-16 pt-10 border-t border-black/10 dark:border-white/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-serif text-2xl font-bold flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Academic Discourse ({comments.length})
              </h3>
            </div>

            {/* Comment Submission Form */}
            <form onSubmit={handleCommentSubmit} className="mb-10">
              <div className="relative rounded-2xl overflow-hidden border border-black/15 dark:border-white/15 bg-white/60 dark:bg-zinc-900/60 p-3 shadow-xs">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    session
                      ? "Contribute your scientific insights, critique, or inquiry..."
                      : "Sign in to contribute your scientific perspective to this paper..."
                  }
                  rows={3}
                  className="w-full bg-transparent resize-none focus:outline-none text-sm p-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 font-body"
                />
                <div className="flex items-center justify-between pt-2 border-t border-black/10 dark:border-white/10">
                  <span className="text-xs text-gray-500 font-mono">
                    {session ? `Posting as ${session.user?.name}` : 'Signed in as Guest'}
                  </span>
                  <button
                    type="submit"
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-40 transition-all shadow-xs"
                  >
                    <Send size={14} />
                    <span>Post Comment</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-black/10 dark:border-white/10 shadow-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      {c.user?.image ? (
                        <img
                          src={c.user.image}
                          alt={c.user.name || 'User'}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                          {c.user?.name?.[0] || 'R'}
                        </div>
                      )}
                      <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">
                        {c.user?.name || 'Reader'}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-body">
                    {c.content}
                  </p>
                </div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-8 text-sm text-gray-500 font-mono italic">
                  Be the first researcher or reader to start the scientific discussion.
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
