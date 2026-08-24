import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const session = await getServerSession(authOptions);
    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
    }

    let userId = (session?.user as any)?.id;

    // If user not authenticated, assign to default reader or admin
    if (!userId) {
      const defaultUser = await prisma.user.findFirst();
      if (!defaultUser) {
        return NextResponse.json({ error: 'No user available to associate comment' }, { status: 400 });
      }
      userId = defaultUser.id;
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        articleId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
