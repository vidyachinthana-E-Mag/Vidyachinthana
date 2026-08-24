import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = await prisma.article.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        author: true,
        comments: {
          include: { user: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      contentSi,
      featuredImage,
      category,
      readTime,
      status,
    } = body;

    const existing = await prisma.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const updated = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(excerpt !== undefined ? { excerpt } : {}),
        ...(content !== undefined
          ? { content: typeof content === 'object' ? JSON.stringify(content) : content }
          : {}),
        ...(contentSi !== undefined
          ? { contentSi: typeof contentSi === 'object' ? JSON.stringify(contentSi) : contentSi }
          : {}),
        ...(featuredImage !== undefined ? { featuredImage } : {}),
        ...(category !== undefined ? { category } : {}),
        ...(readTime !== undefined ? { readTime } : {}),
        ...(status !== undefined
          ? {
              status,
              publishedAt:
                status === 'PUBLISHED' && !existing.publishedAt ? new Date() : existing.publishedAt,
            }
          : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.comment.deleteMany({ where: { articleId: id } });
    await prisma.issueArticle.deleteMany({ where: { articleId: id } });
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
