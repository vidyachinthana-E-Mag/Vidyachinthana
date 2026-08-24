import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Users, BookOpen, Mail, Award, ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Authors & Editorial Fellows — Vidya Chinthana (විද්‍යා චින්තන)',
  description: 'Meet the researchers, theoretical physicists, biologists, and speculative writers contributing to Vidya Chinthana.',
};

export default async function AuthorsPage() {
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ['OWNER', 'EDITOR', 'AUTHOR'],
      },
    },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          readTime: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10 w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest bg-blue-600/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 rounded-full border border-blue-600/20 dark:border-cyan-400/30">
            Faculty & Contributors
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold mt-4 mb-4 tracking-tight text-slate-900 dark:text-slate-100">
            Authors & Editorial Fellows
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-body leading-relaxed">
            The interdisciplinary minds guiding Vidya Chinthana across quantum computation, neural engineering, marine biosystems, and hard science fiction.
          </p>
        </div>

        {/* Authors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((author) => (
            <div
              key={author.id}
              className="p-6 rounded-3xl liquid-card border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={author.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'}
                    alt={author.name || 'Author'}
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 dark:border-cyan-400 shadow-sm"
                  />
                  <div>
                    <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                      {author.name}
                    </h2>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                      {author.role === 'OWNER'
                        ? 'Editor-in-Chief'
                        : author.role === 'EDITOR'
                        ? 'Senior Editor'
                        : 'Staff Fellow'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-body">
                  {author.role === 'OWNER'
                    ? 'Principal Investigator in Topological Quantum Mathematics and Editor-in-Chief of Vidya Chinthana.'
                    : author.role === 'EDITOR'
                    ? 'Senior Fellow researching Cortical Transformer Architectures and Neuromorphic Silicon.'
                    : 'Field Researcher specializing in CRISPR-modified marine reef resilience and speculative futures.'}
                </p>
              </div>

              {/* Published Works */}
              <div className="border-t border-slate-200/80 dark:border-slate-800 pt-4">
                <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider block mb-2">
                  Published Transmissions ({author.articles.length})
                </span>
                <div className="space-y-2">
                  {author.articles.map((art) => (
                    <Link
                      key={art.id}
                      href={`/articles/${art.slug}`}
                      className="text-xs font-serif font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">{art.title}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0 text-blue-600 dark:text-cyan-400" />
                    </Link>
                  ))}
                  {author.articles.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No published articles yet.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
