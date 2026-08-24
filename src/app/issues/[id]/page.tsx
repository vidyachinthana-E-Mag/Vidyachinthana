import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import FlipBook from '@/components/reader/FlipBook';
import { MagazineExport } from '@/components/reader/MagazineExport';
import { ArrowLeft, BookOpen, Layers, Clock, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const issue = await prisma.issue.findFirst({
    where: {
      OR: [{ id }, { number: id }],
    },
  });

  if (!issue) {
    return { title: 'Issue Not Found — Vidya Chinthana' };
  }

  return {
    title: `Issue #${issue.number}: ${issue.title} — Vidya Chinthana`,
    description: issue.description || '',
  };
}

export default async function IssueDetailPage({ params }: PageProps) {
  const { id } = await params;

  const issue = await prisma.issue.findFirst({
    where: {
      OR: [{ id }, { number: id }],
    },
    include: {
      articles: {
        include: {
          article: {
            include: {
              author: {
                select: { name: true, image: true },
              },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!issue) {
    notFound();
  }

  const primaryArticle = issue.articles[0]?.article;

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#FDF9EC] text-[#1D1D1F]">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/issues"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Digital Kiosk</span>
          </Link>
        </div>

        {/* Issue Overview Header */}
        <div className="p-8 rounded-3xl bg-slate-950 text-white shadow-2xl mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                Issue #{issue.number}
              </span>
              <span className="font-mono text-xs text-gray-400">{issue.volume || 'Volume 01'}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
              {issue.title}
            </h1>
            <p className="text-gray-300 text-sm font-body leading-relaxed">
              {issue.description}
            </p>
          </div>

          {issue.coverImage && (
            <div className="w-40 sm:w-48 aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-white/20">
              <img
                src={issue.coverImage}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Interactive FlipBook Section */}
        {primaryArticle ? (
          <div className="mb-14">
            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-mono text-xs uppercase tracking-widest rounded-full font-bold">
                Interactive Magazine Flip Viewer
              </span>
              <p className="text-xs text-gray-500 font-mono mt-2">
                Click corners or use controls to flip pages seamlessly.
              </p>
            </div>

            <FlipBook article={primaryArticle as any} />
            <MagazineExport issue={issue} articles={issue.articles} />
          </div>
        ) : null}

        {/* Issue Articles Index / Table of Contents */}
        <div className="mt-12 p-8 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-black/10 dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-black/10">
            <Layers className="text-blue-600 w-5 h-5" />
            <h2 className="font-serif text-2xl font-bold">
              Table of Contents • Folio Articles
            </h2>
          </div>

          <div className="divide-y divide-black/5 dark:divide-white/5">
            {issue.articles.map((item, idx) => (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-sm font-bold text-blue-600 mt-1">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 block mb-1">
                      {item.article.category}
                    </span>
                    <Link
                      href={`/articles/${item.article.slug}`}
                      className="font-serif text-base font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors"
                    >
                      {item.article.title}
                    </Link>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1 font-body">
                      {item.article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pl-8 sm:pl-0">
                  <span>{item.article.author?.name}</span>
                  <span>•</span>
                  <span>{item.article.readTime}</span>
                  <Link
                    href={`/articles/${item.article.slug}`}
                    className="px-3 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black font-semibold text-xs hover:opacity-80"
                  >
                    Read
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
