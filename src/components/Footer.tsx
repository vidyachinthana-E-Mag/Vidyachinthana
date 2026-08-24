"use client";
import React from 'react';
import Link from 'next/link';
import { Twitter, Facebook, Instagram, Linkedin, Atom, Radio, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full px-4 md:px-8 pb-8 mt-12 relative z-20">
      <div className="max-w-[1280px] mx-auto liquid-glass rounded-3xl p-8 sm:p-10 border border-slate-200/80 dark:border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 lg:gap-12">
          
          {/* Brand & Manifesto */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 dark:bg-cyan-400 flex items-center justify-center text-white dark:text-black shadow-sm">
                <Atom size={16} />
              </div>
              <span className="font-serif font-bold text-slate-900 dark:text-white text-lg tracking-tight">
                Vidya Chinthana (විද්‍යා චින්තන)
              </span>
            </div>
            <p className="font-body text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-6">
              A peer-reviewed, bilingual Sri Lankan digital science publication presenting theoretical breakthroughs, cognitive philosophy, and speculative physics with liquid clarity.
            </p>
            <div className="flex gap-2.5">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-black transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links: Disciplines */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100 mb-4">
              Disciplines
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { name: 'Quantum & Physics', href: '/search?category=SCIENCE' },
                { name: 'Cognitive Computing & AI', href: '/search?category=TECHNOLOGY' },
                { name: 'Biosphere & Marine Ecology', href: '/search?category=EDUCATION' },
                { name: 'Speculative Sci-Fi', href: '/search?category=SCI_FI' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-body text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links: Folios & Fellows */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100 mb-4">
              Archives
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { name: 'Digital Issue #001', href: '/issues/1' },
                { name: 'Editorial Fellows', href: '/authors' },
                { name: 'Manuscript Search', href: '/search' },
                { name: 'Editorial Desk', href: '/admin' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-body text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Links: Editorial Board */}
          <div>
            <h4 className="font-mono text-xs font-bold tracking-wider uppercase text-slate-900 dark:text-slate-100 mb-4">
              Transmission
            </h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { name: 'About Vidya Chinthana', href: '#' },
                { name: 'Peer-Review Protocols', href: '#' },
                { name: 'Bilingual Translation Engine', href: '#' },
                { name: 'Research Submissions', href: '/admin/articles' },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 hover:translate-x-1 transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[11px] text-slate-500 dark:text-slate-400">
          <p>© 2026 Vidya Chinthana Network. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-ping" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                COLOMBO NODE 01 ONLINE
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
