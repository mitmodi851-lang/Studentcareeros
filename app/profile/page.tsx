'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubmissionCard from '@/components/SubmissionCard';
import CertificationCard from '@/components/CertificationCard';
import type { ProfileData, UserCourseProgressItem, CourseProgress } from '@/types';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [courseProgressList, setCourseProgressList] = useState<UserCourseProgressItem[]>([]);
  const [progressLoading, setProgressLoading] = useState(true);

  // Protect route
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/profile');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function loadProfile() {
        try {
          const res = await fetch('/api/profile');
          if (!res.ok) throw new Error('Failed to load profile.');
          const data = await res.json();
          setProfile(data);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
          setLoading(false);
        }
      }
      loadProfile();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'authenticated') {
      async function loadProgress() {
        try {
          const res = await fetch('/api/progress');
          if (res.ok) {
            const data = await res.json();
            setCourseProgressList(data);
          }
        } catch {
          /* silently ignore */
        } finally {
          setProgressLoading(false);
        }
      }
      loadProgress();
    }
  }, [status]);

  const handleProgressUpdate = useCallback(async (certId: string, progress: number) => {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ certification_id: certId, progress }),
    });
    if (res.ok) {
      const updated: UserCourseProgressItem = await res.json();
      setCourseProgressList((prev) => {
        const exists = prev.find((p) => p.certification_id === certId);
        if (exists) {
          return prev.map((p) => (p.certification_id === certId ? updated : p));
        }
        return [...prev, updated];
      });
    }
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading Profile…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // My Learning stats
  const started = courseProgressList.filter((p) => p.progress > 0).length;
  const inProgress = courseProgressList.filter((p) => p.status === 'In Progress').length;
  const completed = courseProgressList.filter((p) => p.status === 'Completed').length;
  const overallProgress =
    courseProgressList.length > 0
      ? Math.round(
          courseProgressList.reduce((sum, p) => sum + p.progress, 0) / courseProgressList.length
        )
      : 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* User Banner */}
        <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-navy-900 dark:text-white">{profile?.name || session?.user?.name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{profile?.email || session?.user?.email}</p>
            </div>
          </div>

          <Link
            href="/test"
            id="retake-test-btn"
            className="btn-primary py-2.5 px-5 text-sm w-full sm:w-auto text-center"
          >
            Retake Aptitude Test
          </Link>
        </div>

        {/* My Learning Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white">My Learning</h2>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-navy-900 px-3 py-1 rounded-full">
              {courseProgressList.length} Courses Tracked
            </span>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card p-4 text-center">
              <p className="text-2xl font-extrabold text-navy-900 dark:text-white">{started}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Courses Started</p>
            </div>
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card p-4 text-center">
              <p className="text-2xl font-extrabold text-amber-500">{inProgress}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">In Progress</p>
            </div>
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card p-4 text-center">
              <p className="text-2xl font-extrabold text-emerald-500">{completed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completed</p>
            </div>
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card p-4 text-center">
              <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-400">{overallProgress}%</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overall Progress</p>
            </div>
          </div>

          {/* Overall Progress Bar */}
          {courseProgressList.length > 0 && (
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Overall Learning Progress</span>
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{overallProgress}%</span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-navy-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    overallProgress === 100 ? 'bg-emerald-500' : 'bg-primary-600'
                  }`}
                  style={{ width: `${overallProgress}%` }}
                  role="progressbar"
                  aria-valuenow={overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Course Cards */}
          {progressLoading ? (
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading your courses…</p>
            </div>
          ) : courseProgressList.length === 0 ? (
            <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-1">No Courses Started Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Take the aptitude test to get personalized course recommendations, then start tracking your progress.
              </p>
              <Link href="/test" className="btn-primary px-6 py-2.5 text-sm">
                Take Aptitude Test
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {courseProgressList.map((item) =>
                item.certification ? (
                  <CertificationCard
                    key={item.certification_id}
                    cert={item.certification}
                    progress={item as CourseProgress}
                    onProgressUpdate={handleProgressUpdate}
                    isLoggedIn={true}
                  />
                ) : null
              )}
            </div>
          )}
        </div>

        {/* Aptitude Test History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-navy-900 dark:text-white">Aptitude Test History</h2>
            <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-navy-900 px-3 py-1 rounded-full">
              {(profile?.submissions || []).length} Submissions
            </span>
          </div>

          {error && (
            <div className="bg-white dark:bg-navy-800 rounded-card p-6 text-center border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm mb-6">
              {error}
            </div>
          )}

          {!error && !profile && (
            <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-400 dark:text-gray-500">Loading test history...</p>
            </div>
          )}

          {!error && profile && (profile.submissions || []).length === 0 && (
            <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-1">No Aptitude Tests Taken Yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Take our 10-question aptitude assessment to discover your strongest tech area and get personalized certification recommendations.
              </p>
              <Link href="/test" className="btn-primary px-6 py-2.5 text-sm">
                Take Aptitude Test Now
              </Link>
            </div>
          )}

          {!error && profile && (profile.submissions || []).length > 0 && (
            <div className="space-y-4">
              {(profile.submissions || []).map((sub) => (
                <SubmissionCard key={sub.id} submission={sub} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
