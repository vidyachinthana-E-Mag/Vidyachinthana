import React from 'react';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AdminDashboardClient } from './AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  const currentUserId = (session?.user as any)?.id;
  const currentUserRole = (session?.user as any)?.role || 'OWNER'; // default to OWNER in dev if unauthenticated demo

  const [totalArticles, submittedArticles, publishedIssues, totalUsers, authorArticlesCount] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: 'SUBMITTED' } }),
    prisma.issue.count(),
    prisma.user.count(),
    currentUserId ? prisma.article.count({ where: { authorId: currentUserId } }) : 0,
  ]);

  const recentManuscripts = await prisma.article.findMany({
    where: currentUserRole === 'AUTHOR' && currentUserId ? { authorId: currentUserId } : undefined,
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  });

  const currentUser = {
    id: currentUserId || 'admin-demo',
    name: session?.user?.name || 'Dr. Elara Vance',
    email: session?.user?.email || 'admin@vidya.lk',
    role: currentUserRole,
    image: session?.user?.image,
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        <AdminDashboardClient
          currentUser={currentUser}
          metrics={{
            totalArticles,
            submittedArticles,
            publishedIssues,
            totalUsers,
            authorArticlesCount,
          }}
          recentManuscripts={recentManuscripts as any}
        />
      </main>
      <Footer />
    </div>
  );
}

