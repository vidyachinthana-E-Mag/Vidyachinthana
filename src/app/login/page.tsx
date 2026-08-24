"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    searchParams.get("error") ? "Invalid credentials or login failed" : ""
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        setError(
          result.error === "CredentialsSignin"
            ? "Invalid email or password"
            : result.error
        );
        setLoading(false);
      } else if (result?.ok) {
        router.push(result.url || "/");
        router.refresh();
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during login");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl liquid-glass border border-slate-200/80 dark:border-slate-800 shadow-2xl">
      <div className="text-center mb-6">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400">
          Vidya Chinthana (විද්‍යා චින්තන)
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold mt-1 text-slate-900 dark:text-slate-100">
          Reader & Editorial Sign In
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-2xl text-xs text-center font-mono">
            {error}
          </div>
        )}
        {searchParams.get("registered") && (
          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-2xl text-xs text-center font-mono">
            Registration successful! Please sign in with your credentials.
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="text"
            className="w-full liquid-glass border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-cyan-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@institution.lk"
            required
            autoComplete="email"
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
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-blue-600 text-white dark:bg-cyan-400 dark:text-black font-semibold py-3 rounded-2xl hover:bg-blue-700 dark:hover:bg-cyan-300 transition-all text-xs tracking-wider uppercase shadow-md disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Authenticating..." : "Sign In to Fellowship"}
        </button>
      </form>

      <div className="mt-6 flex flex-col gap-2 border-t border-slate-200/80 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full liquid-glass border border-slate-200/80 dark:border-slate-800 text-xs font-semibold py-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xs text-slate-800 dark:text-slate-200 cursor-pointer"
        >
          Sign In with Google
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 dark:text-cyan-400 hover:underline font-semibold"
        >
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col font-body">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-6">
        <Suspense fallback={<div className="text-sm font-mono">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
