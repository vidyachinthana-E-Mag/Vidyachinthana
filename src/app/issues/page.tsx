import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { BookOpen, Calendar, ArrowRight, Layers, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Digital Issues & Editions — Vidya Chinthana (විද්‍යා චින්තන)',
  description: 'Explore curated periodic editions and digital interactive flipbook issues of Vidya Chinthana.',
};

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: {
      articles: {
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              category: true,
              readTime: true,
              author: { select: { name: true } },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest bg-blue-600/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 rounded-full border border-blue-600/20 dark:border-cyan-400/30">
            Digital Kiosk & Folios
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-4 mb-4 tracking-tight text-slate-900 dark:text-slate-100">
            Digital Magazine Editions
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-body leading-relaxed">
            Curated compilations of scientific papers, speculative philosophy, and editorial insights bound into interactive 3D digital flipbooks.
          </p>
        </div>

        {/* Issues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-3xl overflow-hidden liquid-card border border-slate-200/80 dark:border-slate-800 flex flex-col group"
            >
              {/* Issue Cover Thumbnail */}
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-950">
                {issue.coverImage ? (
                  <img
                    src={issue.coverImage}
                    alt={issue.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40 font-mono text-xs">
                    Issue Cover
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                    Issue #{issue.number}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full bg-blue-600/80 dark:bg-cyan-500/80 backdrop-blur-md text-white dark:text-black font-mono text-[10px] font-bold">
                    {issue.volume || 'Vol 1'}
                  </span>
                </div>
              </div>

              {/* Issue Details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-serif text-xl font-bold mb-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    {issue.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed font-body">
                    {issue.description}
                  </p>
                </div>

                {/* Contained Articles Count & Action */}
                <div>
                  <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4 mb-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Layers size={14} className="text-blue-600 dark:text-cyan-400" />
                      {issue.articles.length} Featured Papers
                    </span>
                    <span>
                      {issue.publishedAt
                        ? new Date(issue.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Current Issue'}
                    </span>
                  </div>

                  <Link
                    href={`/issues/${issue.number}`}
                    className="w-full py-3 rounded-2xl bg-slate-900 text-white dark:bg-cyan-400 dark:text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md"
                  >
                    <BookOpen size={14} />
                    <span>Open Flipbook Edition</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {issues.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-500 font-mono">
              No digital issues published yet. Use the Editorial Suite to curate Issue #001.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
