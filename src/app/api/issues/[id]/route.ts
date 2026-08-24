import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const issue = await prisma.issue.findFirst({
      where: {
        OR: [{ id }, { number: id }],
      },
      include: {
        articles: {
          include: { article: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    return NextResponse.json(issue);
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
    const { title, number, volume, description, coverImage, status, articleIds } = body;

    const updated = await prisma.issue.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(number !== undefined ? { number } : {}),
        ...(volume !== undefined ? { volume } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(coverImage !== undefined ? { coverImage } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    if (articleIds && Array.isArray(articleIds)) {
      await prisma.issueArticle.deleteMany({ where: { issueId: id } });
      await Promise.all(
        articleIds.map((artId: string, idx: number) =>
          prisma.issueArticle.create({
            data: {
              issueId: id,
              articleId: artId,
              order: idx + 1,
            },
          })
        )
      );
    }

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
    await prisma.issueArticle.deleteMany({ where: { issueId: id } });
    await prisma.issue.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
