import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category');

  try {
    const articles = await prisma.article.findMany({
      where: {
        AND: [
          { status: 'PUBLISHED' },
          category && category !== 'ALL' ? { category: category as any } : {},
          q
            ? {
                OR: [
                  { title: { contains: q } },
                  { excerpt: { contains: q } },
                  { slug: { contains: q } },
                ],
              }
            : {},
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 24,
    });
    return NextResponse.json(articles);
  } catch (err: any) {
    console.error('Search API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
