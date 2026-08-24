'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md p-8 rounded-3xl liquid-glass border border-red-500/20 shadow-2xl">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-500">
          Transmission Interrupted
        </span>
        <h2 className="text-2xl font-serif font-bold mt-2 text-slate-900 dark:text-slate-100">
          Something went wrong
        </h2>
        <p className="text-xs font-body text-slate-600 dark:text-slate-400 mt-2 mb-6">
          {error.message || 'An unexpected operational anomaly occurred in this sector.'}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-full bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-semibold text-xs transition-all hover:opacity-90 shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
