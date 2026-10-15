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
  const [showPassword, setShowPassword] = useState(false);
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

      // NextAuth v5 beta: on failure res is undefined or has error set.
      // On success it returns the redirect URL (a string) or an object without error.
      // We also check for the v4-style .error for safety.
      if (!res || (typeof res === 'object' && 'error' in res && res.error)) {
        setError('Invalid email or password. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Success — navigate to the callback URL
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      // NextAuth v5 beta throws a typed error on credential failure in some versions
      const message =
        err instanceof Error ? err.message : String(err);
      if (
        message.includes('CredentialsSignin') ||
        message.includes('credentials') ||
        message.includes('Invalid')
      ) {
        setError('Invalid email or password. Please check your credentials.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Welcome Back</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to access your aptitude test and profile</p>
      </div>

      {/* Demo Credentials Hint */}
      <div className="mb-6 p-3.5 rounded-xl bg-primary-50/80 dark:bg-primary-950/40 border border-primary-100 dark:border-primary-900/50 text-xs text-primary-900 dark:text-primary-200">
        <p className="font-semibold mb-1 flex items-center gap-1.5 text-primary-800 dark:text-primary-300">
          <span>💡</span> Quick Demo Login:
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          Email: <code className="font-mono bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-primary-200 dark:border-primary-800 text-[11px]">student@example.com</code>
        </p>
        <p className="text-gray-700 dark:text-gray-300 mt-1">
          Password: <code className="font-mono bg-white dark:bg-navy-900 px-1.5 py-0.5 rounded border border-primary-200 dark:border-primary-800 text-[11px]">Password123!</code>
        </p>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5">
          (Or sign up / sign in with any valid email & password)
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
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
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-md transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
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
            Forgot your password? Reset it here
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
