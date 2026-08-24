"use client";
import React from 'react';
import {
  Type,
  Sun,
  Moon,
  BookOpen,
  Scroll,
  Languages,
  Bookmark,
  Share2,
  Maximize2
} from 'lucide-react';

export type FontSizeOption = 'xs' | 'sm' | 'md' | 'lg';
export type ReadingThemeOption = 'light' | 'sepia' | 'dark' | 'paper';
export type ReadingModeOption = 'scroll' | 'flip';
export type LanguageOption = 'en' | 'si';

interface ReadingControlsProps {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  theme: ReadingThemeOption;
  setTheme: (theme: ReadingThemeOption) => void;
  mode: ReadingModeOption;
  setMode: (mode: ReadingModeOption) => void;
  lang: LanguageOption;
  setLang: (lang: LanguageOption) => void;
  onShare?: () => void;
}

export function ReadingControls({
  fontSize,
  setFontSize,
  theme,
  setTheme,
  mode,
  setMode,
  lang,
  setLang,
  onShare,
}: ReadingControlsProps) {
  return (
    <div className="sticky top-4 z-40 w-full max-w-4xl mx-auto my-4 px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg transition-all">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-3 py-1 text-xs font-bold uppercase rounded-lg transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('si')}
            className={`px-3 py-1 text-xs font-bold uppercase rounded-lg transition-all ${
              lang === 'si'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            සිංහල
          </button>
        </div>

        {/* Reading Mode (Scroll vs Flipbook) */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setMode('scroll')}
            title="Scroll Mode"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              mode === 'scroll'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-black'
            }`}
          >
            <Scroll size={14} />
            <span className="hidden sm:inline">Scroll</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('flip')}
            title="Magazine Flip Mode"
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg transition-all ${
              mode === 'flip'
                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:text-black'
            }`}
          >
            <BookOpen size={14} />
            <span className="hidden sm:inline">Magazine Flip</span>
          </button>
        </div>

        {/* Font Size Adjuster */}
        <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
          {(['xs', 'sm', 'md', 'lg'] as FontSizeOption[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setFontSize(sz)}
              className={`px-2.5 py-1 text-xs font-serif uppercase rounded-lg transition-all ${
                fontSize === sz
                  ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-xs font-bold'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Theme Palette */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTheme('paper')}
            title="Editorial Paper Theme"
            className={`w-7 h-7 rounded-full border border-black/20 bg-[#FDF9EC] transition-transform ${theme === 'paper' ? 'ring-2 ring-blue-600 scale-110' : ''}`}
          />
          <button
            type="button"
            onClick={() => setTheme('light')}
            title="Clean Light Theme"
            className={`w-7 h-7 rounded-full border border-black/20 bg-white transition-transform ${theme === 'light' ? 'ring-2 ring-blue-600 scale-110' : ''}`}
          />
          <button
            type="button"
            onClick={() => setTheme('sepia')}
            title="Sepia Warm Theme"
            className={`w-7 h-7 rounded-full border border-black/20 bg-[#f4ecd8] transition-transform ${theme === 'sepia' ? 'ring-2 ring-amber-600 scale-110' : ''}`}
          />
          <button
            type="button"
            onClick={() => setTheme('dark')}
            title="Dark OLED Theme"
            className={`w-7 h-7 rounded-full border border-white/20 bg-[#121216] transition-transform ${theme === 'dark' ? 'ring-2 ring-blue-400 scale-110' : ''}`}
          />
        </div>
      </div>
    </div>
  );
}
