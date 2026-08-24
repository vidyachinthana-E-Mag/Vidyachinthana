"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Search,
  BookOpen,
  Users,
  Sparkles,
  Sun,
  Moon,
  LogIn,
  Layers,
  ChevronRight,
  X,
  Menu,
  Atom,
  Volume2,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, isSciFi } = useTheme();
  const { data: session } = useSession();
  const { user: fbUser, userData, logout: fbLogout } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAudioSimActive, setIsAudioSimActive] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const currentUser = session?.user || (fbUser ? {
    name: fbUser.displayName || 'Reader',
    email: fbUser.email,
    image: fbUser.photoURL,
    role: userData?.role || 'READER',
  } : null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    if (session) await nextAuthSignOut();
    if (fbUser) await fbLogout();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Atom },
    { name: 'Digital Issues', href: '/issues', icon: BookOpen },
    { name: 'Authors & Fellows', href: '/authors', icon: Users },
    { name: 'Explore Archives', href: '/search', icon: Sparkles },
  ];

  return (
    <header className="sticky top-3 z-50 w-full px-3 sm:px-6 transition-all duration-300">
      {/* Floating Dynamic Island Container */}
      <div className="max-w-6xl mx-auto">
        <nav
          className={`liquid-island rounded-full px-3.5 sm:px-5 py-2.5 flex items-center justify-between transition-all duration-300 ${
            isScrolled ? 'shadow-xl scale-[0.98]' : ''
          }`}
        >
          {/* Brand & Animated Core Pill */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 group py-1 pr-2 rounded-full focus:outline-none"
            >
              <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-zinc-950 flex items-center justify-center overflow-hidden">
                  <Atom className="w-4 h-4 text-blue-600 dark:text-cyan-400 animate-[spin_12s_linear_infinite]" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 radar-dot" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                    Vidya Chinthana
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-600/10 dark:bg-cyan-500/20 text-blue-600 dark:text-cyan-300 font-semibold border border-blue-600/20 dark:border-cyan-500/30">
                    විද්‍යා
                  </span>
                </div>
                <span className="text-[9px] font-mono tracking-widest uppercase text-gray-500 dark:text-gray-400 -mt-0.5 hidden sm:inline">
                  Digital Science Folio
                </span>
              </div>
            </Link>

            {/* Live Transmission Tracker Capsule */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/5 dark:border-white/10 text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-gray-700 dark:text-cyan-300 font-medium">Issue #001 Live</span>
              <button
                type="button"
                onClick={() => setIsAudioSimActive(!isAudioSimActive)}
                className="flex items-center gap-0.5 pl-1.5 ml-1 border-l border-black/10 dark:border-white/10 text-gray-400 hover:text-blue-600 dark:hover:text-cyan-400"
                title={isAudioSimActive ? 'Mute ambient synth' : 'Stream ambient frequencies'}
              >
                <div className="flex items-end gap-[2px] h-3.5 px-1">
                  <span className={`w-[2px] rounded-full bg-blue-600 dark:bg-cyan-400 ${isAudioSimActive ? 'sound-bar' : 'h-1'}`} />
                  <span className={`w-[2px] rounded-full bg-blue-600 dark:bg-cyan-400 ${isAudioSimActive ? 'sound-bar' : 'h-2'}`} />
                  <span className={`w-[2px] rounded-full bg-blue-600 dark:bg-cyan-400 ${isAudioSimActive ? 'sound-bar' : 'h-1.5'}`} />
                  <span className={`w-[2px] rounded-full bg-blue-600 dark:bg-cyan-400 ${isAudioSimActive ? 'sound-bar' : 'h-3'}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] dark:bg-white/[0.05] p-1 rounded-full border border-black/5 dark:border-white/10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white dark:text-black shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-island-tab"
                      className="absolute inset-0 rounded-full bg-blue-600 dark:bg-cyan-400 -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon size={13} className={isActive ? 'text-white dark:text-black' : 'opacity-70'} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Island (Search, Sci-Fi/Light Toggle, Auth) */}
          <div className="flex items-center gap-2">
            {/* Inline Dynamic Search Pill */}
            <div className="relative">
              {isSearchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white dark:bg-zinc-900 border border-blue-500/40 dark:border-cyan-400/40 rounded-full pl-3 pr-1 py-1 shadow-lg"
                >
                  <Search size={13} className="text-blue-600 dark:text-cyan-400 mr-2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search disciplines..."
                    className="w-32 sm:w-48 bg-transparent text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none font-body"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X size={13} />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-full text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold"
                  title="Search archives"
                >
                  <Search size={14} className="text-gray-500 dark:text-gray-400" />
                  <span className="hidden sm:inline font-mono text-[11px] text-gray-500 dark:text-gray-400">Search</span>
                </button>
              )}
            </div>

            {/* Theme Toggle Button (Light Polish vs Sci-Fi Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 flex items-center justify-center relative overflow-hidden group ${
                isSciFi
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-400 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                  : 'bg-amber-50 border-amber-200 text-amber-600 hover:border-amber-400 shadow-xs'
              }`}
              title={isSciFi ? 'Switch to Pristine White Light Theme' : 'Engage Cyber Sci-Fi Dark Theme'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isSciFi ? (
                  <motion.div
                    key="dark"
                    initial={{ rotate: -90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={15} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="light"
                    initial={{ rotate: 90, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    exit={{ rotate: -90, scale: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={15} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {/* User Session & Fellowship Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                {((currentUser as any)?.role === 'OWNER' ||
                  (currentUser as any)?.role === 'EDITOR' ||
                  (currentUser as any)?.role === 'AUTHOR') && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600 text-white font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-blue-700 dark:bg-cyan-400 dark:text-black dark:hover:bg-cyan-300 transition-all shadow-sm"
                  >
                    <span>Desk</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-1 border-l border-black/10 dark:border-white/10">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-black/15 dark:border-white/20 bg-stone-200 flex items-center justify-center text-xs font-bold text-gray-800">
                    {currentUser.image ? (
                      <img src={currentUser.image} alt={currentUser.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name?.[0] || 'R'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-[11px] font-mono text-gray-500 hover:text-red-600 transition-colors hidden md:inline"
                  >
                    Exit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white dark:bg-cyan-400 dark:text-black hover:opacity-90 transition-all shadow-xs"
                >
                  Join Folio
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer (Liquid Glass) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="liquid-glass rounded-3xl mt-2 p-5 max-w-6xl mx-auto flex flex-col gap-3 shadow-2xl border border-black/10 dark:border-white/15 lg:hidden"
          >
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                Vidya Chinthana (විද්‍යා චින්තන)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                Issue #001
              </span>
            </div>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-bold'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={16} />
                      <span>{link.name}</span>
                    </div>
                    <ChevronRight size={14} className="opacity-50" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
              {currentUser ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                      {currentUser.name?.[0] || 'U'}
                    </div>
                    <span className="text-xs font-mono font-semibold">{currentUser.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl border border-black/20 dark:border-white/20"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex-1 py-2.5 text-center text-xs font-bold rounded-xl bg-blue-600 text-white dark:bg-cyan-400 dark:text-black"
                  >
                    Register Fellowship
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
