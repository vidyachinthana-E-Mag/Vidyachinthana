"use client";
import React, { useRef, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Article } from '@/types';

interface PageProps {
  number: number;
  children: React.ReactNode;
  title?: string;
}

const Page = forwardRef<HTMLDivElement, PageProps>((props, ref) => {
  return (
    <div
      ref={ref}
      className="page p-8 sm:p-10 bg-[#FDF9EC] text-[#1a1a1a] shadow-md border border-amber-900/10 flex flex-col justify-between h-full select-none"
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-900/15 text-[11px] font-mono tracking-widest text-amber-900/60 uppercase">
          <span>VIDYA CHINTHANA</span>
          <span>{props.title || 'DIGITAL EDITION'}</span>
        </div>
        <div className="prose prose-amber max-w-none font-serif text-[15px] leading-relaxed">
          {props.children}
        </div>
      </div>
      <div className="pt-4 border-t border-amber-900/15 flex items-center justify-between text-[11px] font-mono text-amber-900/50">
        <span>COLOMBO • ACADEMIC PRESS</span>
        <span>Page {props.number}</span>
      </div>
    </div>
  );
});
Page.displayName = 'Page';

interface FlipBookProps {
  article: Partial<Article>;
  lang?: 'en' | 'si';
}

export default function FlipBook({ article, lang = 'en' }: FlipBookProps) {
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(6);

  const contentRaw = lang === 'si' && article.contentSi ? article.contentSi : article.content;
  let parsedParagraphs: string[] = [];

  if (typeof contentRaw === 'object' && contentRaw?.content) {
    parsedParagraphs = contentRaw.content.map((block: any) => {
      if (block.type === 'heading') return `### ${block.content?.map((c: any) => c.text).join('') || ''}`;
      if (block.type === 'blockquote') return `"${block.content?.[0]?.content?.map((c: any) => c.text).join('') || ''}"`;
      return block.content?.map((c: any) => c.text).join('') || '';
    }).filter(Boolean);
  } else if (typeof contentRaw === 'string') {
    parsedParagraphs = contentRaw.split('\n\n').filter(Boolean);
  }

  // Split paragraphs across pages
  const pagesData: string[][] = [];
  let currentChunk: string[] = [];
  let charCount = 0;

  parsedParagraphs.forEach((p) => {
    if (charCount + p.length > 500 && currentChunk.length > 0) {
      pagesData.push(currentChunk);
      currentChunk = [p];
      charCount = p.length;
    } else {
      currentChunk.push(p);
      charCount += p.length;
    }
  });
  if (currentChunk.length > 0) pagesData.push(currentChunk);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      {/* FlipBook Container */}
      <div className="relative w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden bg-stone-900/5 p-4 sm:p-6 border border-stone-300">
        {/* @ts-ignore */}
        <HTMLFlipBook
          ref={bookRef}
          width={440}
          height={600}
          size="stretch"
          minWidth={320}
          maxWidth={550}
          minHeight={450}
          maxHeight={750}
          maxShadowOpacity={0.4}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e: any) => setCurrentPage(e.data)}
          className="flip-book mx-auto"
        >
          {/* Cover Page */}
          <div className="page p-10 bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col justify-between h-full shadow-2xl">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-white/10 text-cyan-300 text-xs font-mono tracking-widest uppercase rounded-full">
                {article.category || 'SCIENCE'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-white tracking-wide">
                {article.title}
              </h1>
              <p className="text-gray-300 text-sm italic line-clamp-3">
                {article.excerpt}
              </p>
            </div>
            <div className="border-t border-white/20 pt-4 flex items-center justify-between text-xs text-gray-400">
              <span>{article.author?.name || 'Editorial Staff'}</span>
              <span>Vidya Chinthana Print Edition</span>
            </div>
          </div>

          {/* Dynamic Content Pages */}
          {pagesData.map((paragraphs, idx) => (
            <Page key={idx} number={idx + 1} title={article.title}>
              <div className="space-y-4">
                {paragraphs.map((paragraph, pIdx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={pIdx} className="font-serif font-bold text-lg text-amber-950 pt-2 border-b border-amber-900/10 pb-1">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('"') && paragraph.endsWith('"')) {
                    return (
                      <blockquote key={pIdx} className="italic border-l-2 border-amber-600 pl-3 text-amber-900 bg-amber-50/60 p-2 rounded">
                        {paragraph}
                      </blockquote>
                    );
                  }
                  return (
                    <p key={pIdx} className="text-justify font-serif text-[14px] leading-relaxed text-stone-800">
                      {paragraph}
                    </p>
                  );
                })}
              </div>
            </Page>
          ))}

          {/* Back Cover */}
          <div className="page p-10 bg-gradient-to-tl from-slate-900 to-zinc-900 text-white flex flex-col justify-between h-full">
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="font-serif text-2xl font-bold">Vidya Chinthana (විද්‍යා චින්තන)</h2>
              <p className="text-gray-400 text-xs max-w-xs">
                A landmark bilingual scientific publication bridging research laboratories, academic institutions, and inquiring minds.
              </p>
            </div>
            <div className="text-center text-[10px] text-gray-500 font-mono">
              © {new Date().getFullYear()} VIDYA CHINTHANA ACADEMIC PRESS
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      {/* Flip Navigation Controls */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 shadow-sm text-sm font-semibold hover:bg-gray-100 transition-all"
        >
          <ChevronLeft size={16} />
          <span>Previous Page</span>
        </button>

        <span className="text-xs font-mono text-gray-500">
          Page {currentPage + 1} of {pagesData.length + 2}
        </span>

        <button
          type="button"
          onClick={() => bookRef.current?.pageFlip()?.flipNext()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-black/10 dark:border-white/10 shadow-sm text-sm font-semibold hover:bg-gray-100 transition-all"
        >
          <span>Next Page</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
