'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CertificationCard from '@/components/CertificationCard';
import type { SubmissionResult, CourseProgress } from '@/types';

export default function ResultsPage({ params: propParams }: { params?: { id: string } }) {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || propParams?.id || '';
  const { data: session, status: sessionStatus } = useSession();
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    // Wait for session to resolve before fetching so we're always authenticated
    if (sessionStatus === 'loading') return;
    if (!id) return;

    async function loadResult() {
      try {
        const res = await fetch(`/api/submissions/${id}`);
        if (!res.ok) {
          if (res.status === 401) throw new Error('Please sign in to view your results.');
          if (res.status === 404) throw new Error('Result not found.');
          if (res.status === 403) throw new Error('Access denied to this result.');
          throw new Error('Failed to load aptitude result.');
        }
        const data = await res.json();
        setResult(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [id, sessionStatus]);

  // Load course progress for logged-in users
  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      fetch('/api/progress')
        .then((r) => r.json())
        .then((list: CourseProgress[]) => {
          const map: Record<string, CourseProgress> = {};
          for (const item of list) {
            map[item.certification_id] = item;
          }
          setProgressMap(map);
        })
        .catch(() => {/* silently ignore */});
    }
  }, [sessionStatus]);

  const handleProgressUpdate = useCallback(async (certId: string, progress: number) => {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certification_id: certId, progress }),
    });
    if (res.ok) {
      const updated: CourseProgress = await res.json();
      setProgressMap((prev) => ({ ...prev, [certId]: updated }));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Analyzing your responses…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-16 text-center">
          <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 p-8 shadow-card">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Result Error</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error || 'Result unavailable.'}</p>
            <div className="flex justify-center gap-4">
              <Link href="/test" className="btn-primary px-6 py-2.5 text-sm">
                Retake Test
              </Link>
              <Link href="/profile" className="btn-outline px-6 py-2.5 text-sm">
                Go to Profile
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const topCats = result?.categories || [];
  const isMultiple = topCats.length > 1;
  const isLoggedIn = sessionStatus === 'authenticated';
  const primaryCatName = topCats[0]?.name || 'Web & Software Development';
  const certifications = result?.certifications || [];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Match Announcement Header */}
        <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-10 mb-10 text-center relative overflow-hidden animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full mb-4">
            Aptitude Analysis Complete
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 dark:text-white mb-4 leading-tight">
            Your Career Match
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6 leading-relaxed">
            {isMultiple ? (
              <>
                Your answers point strongly toward two close fields:{' '}
                {topCats.map((c, i) => (
                  <span key={c.id}>
                    <strong className="text-primary-600 dark:text-primary-400 font-bold">{c.name}</strong>
                    {i === 0 ? ' and ' : ''}
                  </span>
                ))}
                .
              </>
            ) : (
              <>
                Your answers point strongly toward{' '}
                <strong className="text-primary-600 dark:text-primary-400 font-bold">{primaryCatName}</strong>.
              </>
            )}
          </p>

          {/* Top Category Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            {topCats.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm shadow-sm ${cat.color || 'bg-gray-100 text-gray-800'}`}
              >
                <span className="text-lg">{cat.icon || '💻'}</span>
                <span>{cat.name}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-lg mx-auto">
            Based on your answers to our 10 aptitude questions. These categories best align with your working preferences, technical curiosity, and problem-solving style.
          </p>
        </div>

        {/* Recommended Certifications */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Recommended Certifications</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sorted by difficulty level (Beginner → Intermediate → Advanced)
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-navy-900 dark:text-gray-500 px-3 py-1 rounded-full self-start sm:self-auto">
              {certifications.length} Certifications Found
            </span>
          </div>

          {certifications.length === 0 ? (
            <div className="bg-white dark:bg-navy-800 rounded-card p-8 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No specific certifications found for this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((cert) => (
                <CertificationCard
                  key={cert.id}
                  cert={cert}
                  progress={progressMap[cert.id] ?? null}
                  onProgressUpdate={isLoggedIn ? handleProgressUpdate : undefined}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="bg-navy-900 rounded-card-lg p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Want to explore another path or track progress?</h3>
            <p className="text-sm text-gray-400">Retake the test anytime or review past submissions in your profile.</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Link href="/test" className="btn-primary py-2.5 px-5 text-sm text-center flex-1 sm:flex-initial">
              Retake Test
            </Link>
            <Link
              href="/profile"
              className="px-5 py-2.5 text-sm font-semibold text-white border border-gray-700 hover:bg-gray-800 rounded-xl transition-all text-center flex-1 sm:flex-initial"
            >
              View Profile
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
