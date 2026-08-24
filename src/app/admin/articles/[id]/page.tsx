"use client";
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { uploadImageToStorage } from '@/lib/firebase-storage';
import {
  Save,
  Send,
  ArrowLeft,
  Image as ImageIcon,
  Clock,
  Tag,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Upload,
  XCircle,
  ExternalLink,
} from 'lucide-react';

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('SCIENCE');
  const [featuredImage, setFeaturedImage] = useState('');
  const [readTime, setReadTime] = useState('6 min read');
  const [status, setStatus] = useState('DRAFT');
  const [contentEn, setContentEn] = useState<any>(null);
  const [contentSi, setContentSi] = useState<any>(null);

  useEffect(() => {
    fetchArticle();
  }, [articleId]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch article');
      }
      const data = await res.json();
      setTitle(data.title || '');
      setSlug(data.slug || '');
      setExcerpt(data.excerpt || '');
      setCategory(data.category || 'SCIENCE');
      setFeaturedImage(data.featuredImage || '');
      setReadTime(data.readTime || '6 min read');
      setStatus(data.status || 'DRAFT');

      try {
        const parsedEn = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
        setContentEn(parsedEn);
      } catch {
        setContentEn(data.content);
      }

      try {
        const parsedSi = typeof data.contentSi === 'string' ? JSON.parse(data.contentSi) : data.contentSi;
        setContentSi(parsedSi);
      } catch {
        setContentSi(data.contentSi);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: err.message || 'Failed to load article.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToStorage(file, 'articles');
      setFeaturedImage(url);
      setStatusMessage({ text: 'Image uploaded to cloud storage successfully.', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: 'Failed to upload image.', type: 'error' });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleUpdate = async (statusOverride?: string) => {
    if (!title.trim()) {
      setStatusMessage({ text: 'Article title is required.', type: 'error' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const newStatus = statusOverride || status;

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          category,
          featuredImage,
          readTime,
          content: contentEn,
          contentSi: contentSi,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update article');
      }

      setStatus(newStatus);
      setStatusMessage({ text: `Article updated and set to ${newStatus}!`, type: 'success' });
      setTimeout(() => {
        setStatusMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setStatusMessage({ text: err.message || 'Failed to update manuscript.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this research manuscript?')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/admin/articles');
      } else {
        const err = await res.json();
        setStatusMessage({ text: err.error || 'Failed to delete article.', type: 'error' });
      }
    } catch (err) {
      setStatusMessage({ text: 'Network error deleting article.', type: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="p-2 rounded-2xl liquid-glass border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                Manuscript Desk • Peer Review
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
                Edit & Review Paper
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {slug && (
              <Link
                href={`/articles/${slug}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <ExternalLink size={13} />
                <span>Live View</span>
              </Link>
            )}

            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => handleUpdate('DRAFT')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs disabled:opacity-50"
            >
              <Save size={14} />
              <span>Draft</span>
            </button>

            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => handleUpdate('SUBMITTED')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/20 transition-all shadow-xs disabled:opacity-50"
            >
              <Send size={14} />
              <span>Submit Review</span>
            </button>

            <button
              type="button"
              disabled={saving || deleting}
              onClick={() => handleUpdate('PUBLISHED')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white dark:bg-cyan-400 dark:text-black text-xs font-semibold hover:bg-blue-700 dark:hover:bg-cyan-300 transition-all shadow-md disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span>Publish / Approve</span>
            </button>

            <button
              type="button"
              disabled={saving || deleting}
              onClick={handleDelete}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors disabled:opacity-50"
              title="Delete article"
            >
              {deleting ? <Loader2 size={16} className="animate-spin text-red-500" /> : <Trash2 size={16} />}
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {statusMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-xs font-mono animate-in fade-in duration-300 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-slate-500">Retrieving manuscript record...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Editorial Canvas */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title Input */}
              <div className="p-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Manuscript Title
                  </label>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : status === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    Status: {status}
                  </span>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Manuscript title..."
                  className="w-full text-xl sm:text-2xl font-serif font-bold bg-transparent border-b border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-cyan-400 focus:outline-none pb-2 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
              </div>

              {/* Abstract / Excerpt */}
              <div className="p-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Executive Abstract / Excerpt
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Executive summary of the manuscript..."
                  className="w-full text-sm font-serif italic bg-transparent focus:outline-none text-slate-700 dark:text-slate-300 placeholder-slate-400 resize-none"
                />
              </div>

              {/* Rich TipTap Editor Suite */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Bilingual Article Body & Outline Synthesizer
                </label>
                <TipTapEditor
                  articleTitle={title}
                  initialContentEn={contentEn}
                  initialContentSi={contentSi}
                  onChangeEn={json => setContentEn(json)}
                  onChangeSi={json => setContentSi(json)}
                />
              </div>
            </div>

            {/* Metadata Sidebar */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="font-serif font-bold text-base pb-2 border-b border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-100">
                  Taxonomy & Classification
                </h3>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Scientific Discipline
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="SCIENCE">Quantum & Physics (විද්‍යාව)</option>
                    <option value="TECHNOLOGY">Cognitive & AI (තාක්ෂණය)</option>
                    <option value="EDUCATION">Biosphere & Marine (අධ්‍යාපනය)</option>
                    <option value="SCI_FI">Speculative Sci-Fi (විද්‍යා ප්‍රබන්ධ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Estimated Reading Duration
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    placeholder="e.g., 6 min read"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    URL Canonical Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={e => setSlug(e.target.value)}
                    placeholder="canonical-slug"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Featured Visual */}
              <div className="p-6 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
                <h3 className="font-serif font-bold text-base pb-2 border-b border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-100">
                  Featured Visual Asset
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={e => setFeaturedImage(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                  <label className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 hover:bg-blue-100 flex items-center justify-center shrink-0">
                    {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {featuredImage && (
                  <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={featuredImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
