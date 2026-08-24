"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
              Vidya Chinthana (විද්‍යා චින්තන)
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 text-slate-900 dark:text-slate-100">
              Register Fellowship
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-2xl text-xs text-center font-mono">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full liquid-glass border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Samantha Perera"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full liquid-glass border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.lk"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full liquid-glass border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-semibold py-3 rounded-2xl hover:bg-blue-700 dark:hover:bg-cyan-300 transition-all text-xs tracking-wider uppercase shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
