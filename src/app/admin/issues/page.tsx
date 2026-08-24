"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import {
  BookOpen,
  Plus,
  Layers,
  CheckCircle2,
  Trash2,
  Eye,
  Calendar,
  Loader2,
} from 'lucide-react';
import { Article } from '@/types';

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [availableArticles, setAvailableArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for creating issue
  const [title, setTitle] = useState('');
  const [number, setNumber] = useState('');
  const [volume, setVolume] = useState('Volume 01');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800'
  );
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchIssuesAndArticles = async () => {
    setLoading(true);
    try {
      const [issuesRes, articlesRes] = await Promise.all([
        fetch('/api/issues'),
        fetch('/api/articles?status=PUBLISHED'),
      ]);
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json();
        setIssues(issuesData);
        if (issuesData.length > 0) {
          setNumber(String(issuesData.length + 1).padStart(3, '0'));
        } else {
          setNumber('001');
        }
      }
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setAvailableArticles(articlesData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuesAndArticles();
  }, []);

  const toggleArticleSelection = (id: string) => {
    setSelectedArticleIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !number.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          number,
          volume,
          description,
          coverImage,
          articleIds: selectedArticleIds,
          status: 'PUBLISHED',
        }),
      });

      if (res.ok) {
        const newIssue = await res.json();
        setIssues((prev) => [newIssue, ...prev]);
        setShowCreateModal(false);
        setTitle('');
        setDescription('');
        setSelectedArticleIds([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!confirm('Are you sure you want to delete this issue?')) return;
    try {
      const res = await fetch(`/api/issues/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setIssues((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#FDF9EC] text-[#1D1D1F]">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
              Editorial Suite
            </span>
            <h1 className="font-serif text-3xl font-bold">Digital Issues & Folio Builder</h1>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md"
          >
            <Plus size={16} />
            <span>Assemble New Issue</span>
          </button>
        </div>

        {/* Existing Issues Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <span className="text-xs font-mono text-gray-500">Loading digital editions...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="p-6 rounded-3xl bg-white/70 dark:bg-zinc-900/70 border border-black/10 dark:border-white/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-black text-white text-xs font-mono font-bold rounded-full">
                      Issue #{issue.number}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{issue.volume}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-2">{issue.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 font-body">
                    {issue.description}
                  </p>
                </div>

                <div className="border-t border-black/10 dark:border-white/10 pt-4">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-mono mb-4">
                    <span className="flex items-center gap-1">
                      <Layers size={13} className="text-blue-600" />
                      {issue.articles?.length || 0} Articles Bound
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/issues/${issue.number}`}
                      className="flex-1 py-2 text-center rounded-xl bg-black text-white font-semibold text-xs flex items-center justify-center gap-1.5 hover:opacity-80"
                    >
                      <Eye size={13} />
                      <span>Preview Kiosk</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDeleteIssue(issue.id)}
                      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      title="Delete Issue"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Assemble New Issue */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#FDF9EC] dark:bg-zinc-900 border border-black/20 dark:border-white/20 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-black/10">
                <h2 className="font-serif text-2xl font-bold">Assemble Digital Issue Folio</h2>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-black font-mono text-sm"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                      Issue Number
                    </label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="002"
                      className="w-full p-2.5 rounded-xl bg-white border border-black/15 text-xs font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Volume</label>
                    <input
                      type="text"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                      placeholder="Volume 01"
                      className="w-full p-2.5 rounded-xl bg-white border border-black/15 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Issue Title / Theme
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., The Biosphere Synapse & Deep Ocean Genomics"
                    className="w-full p-2.5 rounded-xl bg-white border border-black/15 text-sm font-serif font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Editorial Summary
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the issue focus..."
                    className="w-full p-2.5 rounded-xl bg-white border border-black/15 text-xs resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl bg-white border border-black/15 text-xs font-mono"
                  />
                </div>

                {/* Article Selection Checklist */}
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-2">
                    Select Published Articles to Bind ({selectedArticleIds.length} selected)
                  </label>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-white/60 rounded-xl border border-black/10">
                    {availableArticles.map((art) => {
                      const isSelected = selectedArticleIds.includes(art.id);
                      return (
                        <div
                          key={art.id}
                          onClick={() => toggleArticleSelection(art.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-semibold'
                              : 'bg-white border-black/10 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <span className="line-clamp-1 font-serif">{art.title}</span>
                          <span className="font-mono text-[10px] uppercase text-gray-400">
                            {art.category}
                          </span>
                        </div>
                      );
                    })}
                    {availableArticles.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No published articles found.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-black/5 hover:bg-black/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md"
                  >
                    {isSubmitting ? 'Publishing Issue...' : 'Publish Issue Folio'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
