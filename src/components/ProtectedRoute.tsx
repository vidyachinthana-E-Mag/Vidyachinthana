'use client';

"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
        router.push('/');
      }
    }
  }, [user, userData, loading, router, allowedRoles]);

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDF9EC]">
      <div className="w-8 h-8 border-4 border-[var(--color-accent-cyan)] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) return null;

  return <>{children}</>;
}
