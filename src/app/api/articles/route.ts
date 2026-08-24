import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');

    const articles = await prisma.article.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status: status as any } : {}),
        ...(category && category !== 'ALL' ? { category: category as any } : {}),
      },
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
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      contentSi,
      featuredImage,
      category = 'SCIENCE',
      readTime = '5 min read',
      status = 'DRAFT',
    } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Default slug generation if not provided
    const computedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString(36);

    let authorId = (session?.user as any)?.id;
    if (!authorId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'No user found' }, { status: 400 });
      }
      authorId = defaultUser.id;
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug: computedSlug,
        excerpt: excerpt || '',
        content: typeof content === 'object' ? JSON.stringify(content) : content || '{}',
        contentSi: typeof contentSi === 'object' ? JSON.stringify(contentSi) : contentSi || '{}',
        featuredImage: featuredImage || null,
        category,
        readTime,
        status,
        authorId,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
      include: {
        author: true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
