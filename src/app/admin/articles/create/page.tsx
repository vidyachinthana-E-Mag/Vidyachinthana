"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { TipTapEditor } from '@/components/editor/TipTapEditor';
import { uploadImageToStorage } from '@/lib/firebase-storage';
import {
  Save,
  Send,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
  Clock,
  Tag,
  Loader2,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import Link from 'next/link';

export default function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('SCIENCE');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200'
  );
  const [readTime, setReadTime] = useState('6 min read');
  const [contentEn, setContentEn] = useState<any>(null);
  const [contentSi, setContentSi] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadImageToStorage(file, 'articles');
      setFeaturedImage(url);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Failed to upload image file.');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  const handleSave = async (statusToSet: 'DRAFT' | 'SUBMITTED' | 'PUBLISHED') => {
    if (!title.trim()) {
      setStatusMessage('Error: Article title is required.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          category,
          featuredImage,
          readTime,
          content: contentEn || {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Article draft...' }] }],
          },
          contentSi: contentSi || {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: 'සිංහල කෙටුම්පත...' }] }],
          },
          status: statusToSet,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save article');
      }

      const saved = await res.json();
      setStatusMessage(`Article successfully saved as ${statusToSet}!`);
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-[#FDF9EC] text-[#1D1D1F]">
      <Navigation />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-8 w-full">
        {/* Back Link & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/articles"
              className="p-2 rounded-xl bg-white border border-black/10 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600">
                Editorial Suite • Manuscript Desk
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold">Compose Scientific Paper</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('DRAFT')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-black/15 text-xs font-semibold hover:bg-gray-50 transition-all shadow-xs"
            >
              <Save size={14} />
              <span>Save Draft</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('SUBMITTED')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-xs"
            >
              <Send size={14} />
              <span>Submit for Peer Review</span>
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleSave('PUBLISHED')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all shadow-xs"
            >
              <CheckCircle2 size={14} />
              <span>Publish Directly</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            className={`p-4 rounded-xl mb-6 text-xs font-mono ${
              statusMessage.startsWith('Error')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}
          >
            {statusMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editorial Canvas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Input */}
            <div className="p-6 rounded-2xl bg-white/70 border border-black/10 shadow-sm space-y-3">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Manuscript Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Quantum Coherence in Room-Temperature Topological Insulators"
                className="w-full text-xl sm:text-2xl font-serif font-bold bg-transparent border-b border-black/10 focus:border-blue-600 focus:outline-none pb-2 text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Abstract / Excerpt */}
            <div className="p-6 rounded-2xl bg-white/70 border border-black/10 shadow-sm space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Executive Abstract / Excerpt
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Synthesize the primary hypothesis, methodology, and empirical breakthrough in 2 sentences..."
                className="w-full text-sm font-serif italic bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Rich TipTap Editor Suite */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-gray-500">
                Bilingual Article Body & Outline Synthesizer
              </label>
              <TipTapEditor
                articleTitle={title}
                onChangeEn={(json) => setContentEn(json)}
                onChangeSi={(json) => setContentSi(json)}
              />
            </div>
          </div>

          {/* Publishing Metadata Sidebar */}
          <div className="space-y-6">
            {/* Taxonomy & Properties */}
            <div className="p-6 rounded-2xl bg-white/70 border border-black/10 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base pb-2 border-b border-black/10">
                Taxonomy & Metadata
              </h3>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Scientific Discipline / Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/5 border border-black/10 text-xs font-semibold focus:outline-none"
                >
                  <option value="SCIENCE">Quantum & Physics (විද්‍යාව)</option>
                  <option value="TECHNOLOGY">Cognitive & AI (තාක්ෂණය)</option>
                  <option value="EDUCATION">Biosphere & Marine (අධ්‍යාපනය)</option>
                  <option value="SCI_FI">Speculative Sci-Fi (විද්‍යා ප්‍රබන්ධ)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  Estimated Reading Duration
                </label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="e.g., 6 min read"
                  className="w-full p-2.5 rounded-xl bg-black/5 border border-black/10 text-xs font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">
                  URL Canonical Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="quantum-coherence-topological"
                  className="w-full p-2.5 rounded-xl bg-black/5 border border-black/10 text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Featured Visual */}
            <div className="p-6 rounded-2xl bg-white/70 border border-black/10 shadow-sm space-y-3">
              <h3 className="font-serif font-bold text-base pb-2 border-b border-black/10">
                Hero Visual Asset
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 p-2.5 rounded-xl bg-black/5 border border-black/10 text-xs font-mono focus:outline-none"
                />
                <label className="cursor-pointer px-3.5 py-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 flex items-center justify-center shrink-0">
                  {isUploadingImage ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {featuredImage && (
                <div className="aspect-video rounded-xl overflow-hidden border border-black/10">
                  <img
                    src={featuredImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
