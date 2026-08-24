'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Users, BookOpen, Layers, Activity, FileText } from 'lucide-react';

export function AdminDashboardClient({ currentUser, metrics, recentManuscripts }: any) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Command Center</h1>
          <p className="text-slate-500 font-mono text-sm mt-1">Logged in as {currentUser.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentUser.role === 'OWNER' && (
          <>
            <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800">
              <Users size={24} className="text-blue-600 dark:text-cyan-400 mb-2" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalUsers}</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Users</div>
            </div>
          </>
        )}
        <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800">
          <BookOpen size={24} className="text-blue-600 dark:text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.totalArticles}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Total Articles</div>
        </div>
        <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800">
          <Layers size={24} className="text-blue-600 dark:text-cyan-400 mb-2" />
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.publishedIssues}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Published Issues</div>
        </div>
        {(currentUser.role === 'EDITOR' || currentUser.role === 'OWNER') && (
          <div className="p-6 rounded-2xl liquid-glass border border-slate-200 dark:border-slate-800">
            <Activity size={24} className="text-blue-600 dark:text-cyan-400 mb-2" />
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{metrics.submittedArticles}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Pending Review</div>
          </div>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        {currentUser.role === 'OWNER' && (
          <>
            <button 
              onClick={() => router.push('/admin/users')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
            >
              User Management
            </button>
            <button 
              onClick={() => router.push('/admin/settings')}
              className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
            >
              Site Settings
            </button>
          </>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-serif font-bold mb-4">Recent Manuscripts</h2>
        <div className="grid gap-3">
          {recentManuscripts.map((m: any) => (
            <div key={m.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">{m.title}</h3>
                <p className="text-xs font-mono text-slate-500 mt-1">Status: {m.status} | By {m.author?.name || 'Unknown'}</p>
              </div>
            </div>
          ))}
          {recentManuscripts.length === 0 && <p className="text-sm text-slate-500">No manuscripts found.</p>}
        </div>
      </div>
    </div>
  );
}
