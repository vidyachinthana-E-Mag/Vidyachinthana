'use client';
import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';

export default function SettingsPage() {
  const handlePurge = async () => {
    await fetch('/api/admin/purge-cache', { method: 'POST' });
    alert('Cache purged successfully');
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full">
        <h1 className="text-3xl font-serif font-bold mb-6">Site Settings</h1>
        <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-4">Cache Management</h2>
          <button 
            onClick={handlePurge}
            className="px-4 py-2 bg-red-600 text-white rounded font-semibold"
          >
            Purge All Caches
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
