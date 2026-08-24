"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  FileText,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Edit,
  Eye,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Article } from '@/types';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/articles${statusFilter !== 'ALL' ? `?status=${statusFilter}` : ''}`
      );
      if (res.ok) {
        const data = await res.json();
        setArticles(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus as any } : a))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you certain you wish to purge this manuscript from the archive?')) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const statuses = [
    { id: 'ALL', label: 'All Manuscripts' },
    { id: 'SUBMITTED', label: 'In Review (Submitted)' },
    { id: 'DRAFT', label: 'Drafts' },
    { id: 'APPROVED', label: 'Approved' },
    { id: 'PUBLISHED', label: 'Published' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#FDF9EC] text-[#1D1D1F]">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                Editorial Suite
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold">Manuscripts & Articles Directory</h1>
          </div>

          <Link
            href="/admin/articles/create"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>New Manuscript</span>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-black/10 pb-4">
          {statuses.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                statusFilter === st.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-xs'
                  : 'bg-white/60 dark:bg-zinc-900/60 text-gray-700 hover:bg-black/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Articles Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-xs font-mono text-gray-500">Querying manuscript database...</span>
          </div>
        ) : articles.length > 0 ? (
          <div className="rounded-3xl overflow-hidden bg-white/70 dark:bg-zinc-900/70 border border-black/10 dark:border-white/10 shadow-sm">
            <div className="divide-y divide-black/5 dark:divide-white/5">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-black/[0.02] transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                          art.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-800'
                            : art.status === 'APPROVED'
                            ? 'bg-blue-100 text-blue-800'
                            : art.status === 'SUBMITTED'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {art.status}
                      </span>
                      <span className="text-xs font-mono text-gray-400 font-bold uppercase">
                        {art.category}
                      </span>
                    </div>

                    <Link
                      href={`/articles/${art.slug}`}
                      className="font-serif text-base font-bold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors block"
                    >
                      {art.title}
                    </Link>

                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                      <span>Author: {art.author?.name || 'Fellow'}</span>
                      <span>•</span>
                      <span>Slug: /{art.slug}</span>
                      <span>•</span>
                      <span>{art.readTime || '5 min read'}</span>
                    </div>
                  </div>

                  {/* Actions & Workflow Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {art.status !== 'PUBLISHED' && (
                      <button
                        type="button"
                        disabled={actionLoading === art.id}
                        onClick={() => handleUpdateStatus(art.id, 'PUBLISHED')}
                        className="px-3 py-1.5 rounded-xl bg-green-600 text-white font-semibold text-xs hover:bg-green-700 transition-all shadow-xs flex items-center gap-1"
                        title="Publish to Live Magazine"
                      >
                        <CheckCircle size={13} />
                        <span>Publish</span>
                      </button>
                    )}

                    {art.status === 'SUBMITTED' && (
                      <button
                        type="button"
                        disabled={actionLoading === art.id}
                        onClick={() => handleUpdateStatus(art.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-xs"
                      >
                        Approve
                      </button>
                    )}

                    {art.status === 'PUBLISHED' && (
                      <button
                        type="button"
                        disabled={actionLoading === art.id}
                        onClick={() => handleUpdateStatus(art.id, 'DRAFT')}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-all shadow-xs"
                      >
                        Unpublish
                      </button>
                    )}

                    <Link
                      href={`/articles/${art.slug}`}
                      className="p-2 rounded-xl bg-black/5 hover:bg-black/10 transition-colors text-gray-700"
                      title="View Article"
                    >
                      <Eye size={15} />
                    </Link>

                    <button
                      type="button"
                      disabled={actionLoading === art.id}
                      onClick={() => handleDelete(art.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16 p-8 rounded-3xl bg-white/40 border border-black/10 font-mono text-xs text-gray-500">
            No manuscripts found for status filter "{statusFilter}".
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
