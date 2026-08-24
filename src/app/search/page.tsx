"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { Search as SearchIcon, Sparkles, Loader2 } from 'lucide-react';
import { Article } from '@/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'ALL';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const catParam = category !== 'ALL' ? `&category=${category}` : '';
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}${catParam}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 250);
    return () => clearTimeout(timer);
  }, [query, category]);

  const categories = [
    { id: 'ALL', label: 'All Disciplines' },
    { id: 'SCIENCE', label: 'Quantum & Physics (විද්‍යාව)' },
    { id: 'TECHNOLOGY', label: 'Cognitive & AI (තාක්ෂණය)' },
    { id: 'EDUCATION', label: 'Biosphere (අධ්‍යාපනය)' },
    { id: 'SCI_FI', label: 'Speculative Sci-Fi (විද්‍යා ප්‍රබන්ධ)' },
  ];

  return (
    <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-8 py-10 w-full">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest bg-blue-600/10 text-blue-600 dark:bg-cyan-400/20 dark:text-cyan-300 rounded-full border border-blue-600/20 dark:border-cyan-400/30">
          Manuscript Exploration
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold mt-4 mb-3 tracking-tight text-slate-900 dark:text-slate-100">
          Scientific Discovery & Archives
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm font-body">
          Search peer-reviewed papers, speculative essays, and digital folios across Sri Lanka and global networks.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by keywords, titles, or concepts (e.g. quantum, neuroscience, coral)..."
            className="w-full pl-12 pr-4 py-4 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-400 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 font-body shadow-sm"
          />
          <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
              category === cat.id
                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-black shadow-md'
                : 'liquid-glass text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 dark:hover:border-cyan-400/40'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-spin" />
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Searching Vidya Chinthana index...</span>
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-6">
            Found {results.length} scientific publications matching your criteria
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((article) => (
              <div key={article.id} className="h-full">
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 p-8 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800">
          <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold mb-1 text-slate-900 dark:text-slate-100">No transmissions found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono max-w-sm mx-auto">
            Try searching with different terminology or select "All Disciplines".
          </p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <Loader2 className="w-6 h-6 text-blue-600 dark:text-cyan-400 animate-spin" />
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
