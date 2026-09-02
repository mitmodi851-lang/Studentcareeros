'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/events';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password. Please check your credentials.');
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-navy-900 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-bold mx-auto mb-3">
          🔑
        </div>
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Welcome Back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access your aptitude test and profile</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
          <span className="text-base">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="signin-email" className="block text-sm font-medium text-navy-900 dark:text-gray-200 mb-1.5">
            Email Address
          </label>
          <input
            id="signin-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@university.edu"
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="signin-password" className="block text-sm font-medium text-navy-900 dark:text-gray-200">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              id="forgot-password-link"
              className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="signin-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field"
          />
        </div>

        <button
          id="signin-submit"
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3 rounded-xl shadow-sm text-sm font-semibold mt-2"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <div className="pt-2 text-center">
          <Link
            href="/auth/forgot-password"
            id="forgot-password-btn"
            className="inline-block text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline py-1"
          >
            🔒 Forgot your password? Reset it here →
          </Link>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 pt-6 border-t border-gray-100 dark:border-gray-800">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-center py-10 text-gray-400">Loading Sign In…</div>}>
          <SignInForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
