import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Transmissions & Research Archive — Vidya Chinthana',
};

export default async function ArticlesIndexPage() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { createdAt: 'desc' },
    include: {
      author: { select: { name: true, image: true } },
    },
  });

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-12 w-full">
        <h1 className="text-4xl font-serif font-bold mb-8">All Transmissions</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <article key={article.id} className="p-6 border border-slate-200 rounded-xl">
              <h2 className="text-xl font-serif font-bold mb-2">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>
              <p className="text-sm text-slate-600 mb-4">{article.excerpt}</p>
              <Link href={`/articles/${article.slug}`} className="text-blue-600 hover:underline text-sm font-semibold">
                Read More
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
