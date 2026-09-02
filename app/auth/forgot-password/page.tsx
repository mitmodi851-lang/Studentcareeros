'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const passwordsMatch = password === confirm;
  const isValid = email.length > 0 && password.length >= 8 && confirm.length > 0 && passwordsMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!isValid) {
      if (!passwordsMatch) {
        setError('Passwords do not match.');
      } else if (password.length < 8) {
        setError('Password must be at least 8 characters.');
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password. Please try again.');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-navy-900 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl mx-auto mb-3">
              🔒
            </div>
            <h1 className="text-2xl font-bold text-navy-900 dark:text-white">Reset Password</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Enter your registered email and choose a new password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success ? (
            <div className="space-y-4 text-center">
              <div className="text-5xl">✅</div>
              <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                Password Reset Successfully!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You can now sign in with your new password.
              </p>
              <Link
                href="/auth/signin"
                className="block btn-primary px-6 py-2.5 text-sm"
              >
                Go to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-navy-900 dark:text-gray-200 mb-1.5">
                  Registered Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  className="input-field"
                />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="forgot-password" className="block text-sm font-medium text-navy-900 dark:text-gray-200 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="forgot-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {password.length > 0 && password.length < 8 && (
                  <p className="mt-1 text-xs text-red-500">Password must be at least 8 characters.</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="forgot-confirm" className="block text-sm font-medium text-navy-900 dark:text-gray-200 mb-1.5">
                  Confirm New Password
                </label>
                <input
                  id="forgot-confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="input-field"
                />
                {confirm.length > 0 && !passwordsMatch && (
                  <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
                )}
                {confirm.length > 0 && passwordsMatch && password.length >= 8 && (
                  <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">✓ Passwords match</p>
                )}
              </div>

              <button
                id="forgot-submit"
                type="submit"
                disabled={loading || !isValid}
                className="w-full btn-primary py-3 rounded-xl shadow-sm text-sm font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  ← Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
