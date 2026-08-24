import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArticleReader } from '@/components/reader/ArticleReader';
import type { Metadata } from 'next';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  });

  if (!article) {
    return {
      title: 'Article Not Found — Vidya Chinthana',
    };
  }

  return {
    title: `${article.title} — Vidya Chinthana (විද්‍යා චින්තන)`,
    description: article.excerpt || 'Read this scientific feature on Vidya Chinthana.',
    openGraph: {
      title: article.title,
      description: article.excerpt || '',
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  // Parse JSON content if needed
  let parsedContent = article.content;
  try {
    if (typeof article.content === 'string') {
      parsedContent = JSON.parse(article.content);
    }
  } catch {
    parsedContent = article.content;
  }

  let parsedContentSi = article.contentSi;
  try {
    if (typeof article.contentSi === 'string') {
      parsedContentSi = JSON.parse(article.contentSi);
    }
  } catch {
    parsedContentSi = article.contentSi;
  }

  const formattedArticle = {
    ...article,
    content: parsedContent,
    contentSi: parsedContentSi,
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1">
        <ArticleReader
          article={formattedArticle as any}
          initialComments={article.comments as any}
        />
      </main>
      <Footer />
    </div>
  );
}
