'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import EventFilters from '@/components/EventFilters';
import type { CareerEvent } from '@/types';

function EventsContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get('type') ?? '';
  const mode = searchParams.get('mode') ?? '';

  const [events, setEvents] = useState<CareerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.set('type', type);
      if (mode && mode !== 'all') params.set('mode', mode);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to load events');
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch {
      setError('Could not load events. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [type, mode, debouncedSearch]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <>
      <EventFilters
        search={search}
        type={type}
        mode={mode}
        onSearchChange={setSearch}
      />

      {/* Result Count */}
      {!loading && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Showing <span className="font-semibold text-navy-900 dark:text-white">{events.length}</span>{' '}
          {events.length === 1 ? 'event' : 'events'}
          {debouncedSearch && (
            <> for &ldquo;<span className="font-medium text-primary-600 dark:text-primary-400">{debouncedSearch}</span>&rdquo;</>
          )}
        </p>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 h-64 animate-pulse">
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-20 bg-gray-100 dark:bg-navy-700 rounded-full" />
                  <div className="h-5 w-16 bg-gray-100 dark:bg-navy-700 rounded-full" />
                </div>
                <div className="h-5 bg-gray-100 dark:bg-navy-700 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-navy-700 rounded w-full" />
                <div className="h-4 bg-gray-100 dark:bg-navy-700 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-navy-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && events.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Try adjusting your filters or search term.</p>
        </div>
      )}

      {/* Events Grid */}
      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-2">Career Events</h1>
            <p className="text-gray-500 dark:text-gray-400">Hackathons, AI Summits, Workshops, Competitions & Webinars — sorted by nearest date.</p>
          </div>
          <Link
            href="/courses"
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500/10 to-primary-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-semibold text-xs rounded-xl flex items-center gap-2 hover:shadow-sm transition-all shrink-0"
          >
            <span>🔥 Looking for Courses & Video Tutorials?</span>
            <span className="font-bold underline">Explore Courses →</span>
          </Link>
        </div>

        <Suspense fallback={<div className="text-center py-10 text-gray-400">Loading filters…</div>}>
          <EventsContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
