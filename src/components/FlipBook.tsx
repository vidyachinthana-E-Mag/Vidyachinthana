'use client';

"use client";
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface FlipBookProps {
  pages: { title?: string; htmlContent: string; pageNumber: number }[];
  title?: string;
  author?: string;
  coverImage?: string;
}

export function FlipBook({ pages, title, author, coverImage }: FlipBookProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isDualPage, setIsDualPage] = useState(true);

  const totalPages = pages.length + (coverImage ? 1 : 0);

  const handleNext = () => {
    setCurrentPageIndex((prev) => Math.min(prev + (isDualPage ? 2 : 1), totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPageIndex((prev) => Math.max(prev - (isDualPage ? 2 : 1), 0));
  };

  return (
    <div className="w-full flex flex-col items-center my-8 select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between w-full max-w-4xl px-4 py-3 mb-6 glass rounded-2xl border border-[var(--color-glass-border)]">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--color-accent-cyan)]" />
          <span className="font-display text-sm font-bold text-[var(--color-text-primary)]">
            MAGAZINE EDITION
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDualPage(!isDualPage)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans font-semibold border border-[var(--color-glass-border)] hover:border-[var(--color-accent-cyan)] text-[var(--color-text-secondary)] transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            {isDualPage ? 'Two-Page View' : 'Single Page'}
          </button>
          <div className="font-mono text-xs text-[var(--color-text-muted)] bg-[rgba(0,0,0,0.03)] px-3 py-1 rounded-full">
            Page {currentPageIndex + 1} / {totalPages}
          </div>
        </div>
      </div>

      {/* Book Container with 3D Perspective */}
      <div className="relative w-full max-w-4xl min-h-[560px] md:min-h-[640px] flex justify-center items-stretch perspective-[1500px]">
        {/* Left Page / Previous */}
        <div className="w-full sm:w-1/2 bg-white dark:bg-[#121218] p-8 md:p-12 rounded-l-2xl shadow-[-10px_10px_30px_rgba(0,0,0,0.08)] border-y border-l border-[var(--color-glass-border)] flex flex-col justify-between relative overflow-hidden transition-all duration-500">
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-[rgba(0,0,0,0.05)] pointer-events-none" />
          {currentPageIndex === 0 && coverImage ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <div className="w-28 h-28 rounded-2xl overflow-hidden mb-6 shadow-md border border-[var(--color-glass-border)]">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
              <span className="font-display text-[10px] tracking-widest uppercase text-[var(--color-accent-cyan)] font-bold mb-2">
                SPECIAL ISSUE
              </span>
              <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-3 leading-tight">
                {title}
              </h2>
              <p className="font-sans text-xs text-[var(--color-text-muted)]">By {author || 'Editorial Staff'}</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {pages[currentPageIndex - (coverImage ? 1 : 0)] && (
                <div
                  className="prose prose-sm md:prose-base font-body text-[var(--color-text-secondary)] leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: pages[currentPageIndex - (coverImage ? 1 : 0)].htmlContent,
                  }}
                />
              )}
            </div>
          )}
          <div className="text-center font-mono text-[10px] text-[var(--color-text-muted)] mt-4">
            {currentPageIndex + 1}
          </div>
        </div>

        {/* Right Page / Next */}
        <div
          className={`${
            isDualPage ? 'hidden sm:flex' : 'hidden'
          } sm:w-1/2 bg-[#FCFCFA] dark:bg-[#15151D] p-8 md:p-12 rounded-r-2xl shadow-[10px_10px_30px_rgba(0,0,0,0.08)] border-y border-r border-[var(--color-glass-border)] flex-col justify-between relative overflow-hidden transition-all duration-500`}
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-l from-transparent to-[rgba(0,0,0,0.05)] pointer-events-none" />
          <div className="flex-1 flex flex-col">
            {pages[currentPageIndex + 1 - (coverImage ? 1 : 0)] ? (
              <div
                className="prose prose-sm md:prose-base font-body text-[var(--color-text-secondary)] leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: pages[currentPageIndex + 1 - (coverImage ? 1 : 0)].htmlContent,
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-[var(--color-text-muted)]">
                <span className="font-display text-sm uppercase tracking-widest">Vidya Chinthana</span>
                <p className="font-sans text-xs mt-2">End of section</p>
              </div>
            )}
          </div>
          <div className="text-center font-mono text-[10px] text-[var(--color-text-muted)] mt-4">
            {currentPageIndex + 2}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          disabled={currentPageIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider glass glass-hover disabled:opacity-40 disabled:pointer-events-none text-[var(--color-text-primary)]"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" /> Previous
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: Math.ceil(totalPages / (isDualPage ? 2 : 1)) }).map((_, idx) => {
            const pageIndex = idx * (isDualPage ? 2 : 1);
            return (
              <button
                key={idx}
                onClick={() => setCurrentPageIndex(pageIndex)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentPageIndex === pageIndex || (isDualPage && currentPageIndex + 1 === pageIndex)
                    ? 'w-6 bg-[var(--color-accent-cyan)] shadow-[0_0_8px_rgba(74,124,247,0.5)]'
                    : 'bg-[var(--color-glass-border)] hover:bg-[var(--color-text-muted)]'
                }`}
                aria-label={`Jump to page ${pageIndex + 1}`}
              />
            );
          })}
        </div>
        <button
          onClick={handleNext}
          disabled={currentPageIndex >= totalPages - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider bg-[var(--color-accent-cyan)] text-white hover:bg-opacity-90 transition-all shadow-[0_4px_16px_rgba(74,124,247,0.25)] disabled:opacity-40 disabled:pointer-events-none"
          aria-label="Next Page"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
