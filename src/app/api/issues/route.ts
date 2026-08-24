import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      include: {
        articles: {
          include: {
            article: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(issues);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      number,
      volume = 'Volume 01',
      description = '',
      coverImage,
      articleIds = [],
      status = 'PUBLISHED',
    } = body;

    if (!title || !number) {
      return NextResponse.json({ error: 'Title and issue number are required' }, { status: 400 });
    }

    const issue = await prisma.issue.create({
      data: {
        title,
        number,
        volume,
        description,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    // Link articles
    if (articleIds && Array.isArray(articleIds) && articleIds.length > 0) {
      await Promise.all(
        articleIds.map((artId: string, idx: number) =>
          prisma.issueArticle.create({
            data: {
              issueId: issue.id,
              articleId: artId,
              order: idx + 1,
            },
          })
        )
      );
    }

    const fullIssue = await prisma.issue.findUnique({
      where: { id: issue.id },
      include: {
        articles: {
          include: { article: true },
        },
      },
    });

    return NextResponse.json(fullIssue, { status: 201 });
  } catch (error: any) {
    console.error('Error creating issue:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
