import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vidyachinthana.lk';

  // Base routes
  const routes = [
    '',
    '/articles',
    '/issues',
    '/authors',
    '/search',
    '/login',
    '/register',
  ].map((route) => ({
    url: ${baseUrl},
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    });

    const articleUrls = articles.map((article) => ({
      url: ${baseUrl}/articles/,
      lastModified: article.updatedAt.toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    }));

    return [...routes, ...articleUrls];
  } catch {
    return routes;
  }
}
