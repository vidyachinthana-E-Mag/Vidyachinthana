import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { ArticleCard } from '@/components/ArticleCard';
import { BreakingNews } from '@/components/BreakingNews';
import { BookOpen, Sparkles, ArrowRight, Atom, Brain, Dna, Rocket, Layers, Radio, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const latestIssue = await prisma.issue.findFirst({
    include: {
      articles: {
        include: {
          article: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const featured = articles[0] || null;
  const secondaryList = articles.slice(1);

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />

      <main className="flex-1 pb-12">
        <BreakingNews />

        {/* Cinematic Hero */}
        {featured && <Hero article={featured} />}

        {/* Category Ticker / Disciplines */}
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 my-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/search?category=SCIENCE"
              className="p-4 sm:p-5 rounded-3xl liquid-card group flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:bg-cyan-500/20 dark:text-cyan-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
                <Atom size={22} className="group-hover:rotate-180 transition-transform duration-700" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                  Quantum & Physics
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">විද්‍යාව • Science</p>
              </div>
            </Link>

            <Link
              href="/search?category=TECHNOLOGY"
              className="p-4 sm:p-5 rounded-3xl liquid-card group flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800"
            >
              <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
                <Brain size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Cognitive & AI
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">තාක්ෂණය • Tech</p>
              </div>
            </Link>

            <Link
              href="/search?category=EDUCATION"
              className="p-4 sm:p-5 rounded-3xl liquid-card group flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800"
            >
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
                <Dna size={22} className="group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Biosphere & Coral
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">අධ්‍යාපනය • Bio</p>
              </div>
            </Link>

            <Link
              href="/search?category=SCI_FI"
              className="p-4 sm:p-5 rounded-3xl liquid-card group flex items-center gap-3.5 border border-slate-200/80 dark:border-slate-800"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs">
                <Rocket size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  Speculative Sci-Fi
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">විද්‍යා ප්‍රබන්ධ • Sci-Fi</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Featured Digital Issue Showcase */}
        {latestIssue && (
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 my-8">
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 dark:border-cyan-500/30">
              {/* Ambient holographic glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-4 max-w-xl relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 bg-cyan-400/20 text-cyan-300 font-mono text-xs uppercase tracking-widest rounded-full border border-cyan-400/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>Curated Folio • Issue #{latestIssue.number}</span>
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{latestIssue.volume}</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
                  {latestIssue.title}
                </h2>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {latestIssue.description}
                </p>

                <div className="pt-3 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/issues/${latestIssue.number}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-black font-semibold text-xs tracking-wider uppercase hover:bg-cyan-300 transition-all shadow-lg hover:shadow-cyan-400/40"
                  >
                    <BookOpen size={16} />
                    <span>Open 3D Flipbook Edition</span>
                  </Link>

                  <Link
                    href="/issues"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white font-semibold text-xs hover:bg-white/20 transition-all border border-white/10"
                  >
                    <span>Browse All Archives</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* 3D Cover Image Flip Thumbnail */}
              {latestIssue.coverImage && (
                <div className="relative w-48 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform md:rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 flex-shrink-0">
                  <img
                    src={latestIssue.coverImage}
                    alt={latestIssue.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                    <span className="font-mono text-[10px] text-cyan-300 uppercase tracking-widest">DIGITAL FOLIO</span>
                    <span className="font-serif text-sm font-bold">{latestIssue.title}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editorial Feed & Sidebar Grid */}
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 my-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            {/* Main Articles List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 rounded-full bg-blue-600 dark:bg-cyan-400" />
                  <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    Recent Papers & Transmissions
                  </h3>
                </div>
                <Link
                  href="/search"
                  className="text-xs font-semibold font-mono text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Explore All ({articles.length})</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {secondaryList.map((art) => (
                  <div key={art.id} className="h-full">
                    <ArticleCard article={art} />
                  </div>
                ))}
                {secondaryList.length === 0 && (
                  <p className="text-gray-500 font-mono text-sm col-span-2 py-8">
                    More peer-reviewed papers are currently under review.
                  </p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Editor-in-Chief Letter */}
              <div className="p-6 sm:p-7 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 relative overflow-hidden">
                <div className="flex items-center gap-3.5 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop"
                    alt="Dr. Elara Vance"
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-600 dark:border-cyan-400 shadow-sm"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                      Dr. Elara Vance
                    </h4>
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-cyan-400">
                      Editor-in-Chief • Colombo
                    </span>
                  </div>
                </div>

                <h5 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-2">
                  The Sri Lankan Frontier of Science
                </h5>

                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mb-4 font-body">
                  "Vidya Chinthana was born from the conviction that profound science and elevated prose are inseparable. As topological quantum hardware and generative biological algorithms emerge, we celebrate Sri Lankan researchers bridging global frontiers."
                </p>

                <Link
                  href="/articles/the-quantum-horizon"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline font-mono uppercase tracking-wider"
                >
                  <span>Read Inaugural Editorial</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              {/* Trending Topics Rail */}
              <div className="p-6 sm:p-7 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800">
                <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>Curated Readings</span>
                </h4>

                <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {articles.slice(0, 4).map((art, idx) => (
                    <Link
                      key={art.id}
                      href={`/articles/${art.slug}`}
                      className="py-3 flex items-start gap-3 group block"
                    >
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-cyan-400 opacity-80 mt-0.5">
                        0{idx + 1}
                      </span>
                      <div>
                        <h6 className="font-serif text-xs font-semibold leading-snug text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {art.title}
                        </h6>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {art.readTime || '5 min read'} • {art.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
