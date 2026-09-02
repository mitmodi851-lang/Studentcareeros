'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';

const EVENT_TYPES = ['All', 'Hackathon', 'AI Summit', 'Workshop', 'Competition', 'Webinar'];
const EVENT_MODES = ['All', 'Online', 'Offline', 'Hybrid'];

interface EventFiltersProps {
  search: string;
  type: string;
  mode: string;
  onSearchChange: (value: string) => void;
}

export default function EventFilters({ search, type, mode, onSearchChange }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'All' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            id="event-search"
            type="text"
            placeholder="Search events, organizers…"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="sm:w-44">
          <select
            id="event-type-filter"
            value={type || 'All'}
            onChange={(e) => updateFilter('type', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-200 cursor-pointer transition-all"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t === 'All' ? 'all' : t} className="bg-white dark:bg-navy-900 text-gray-900 dark:text-gray-100">{t === 'All' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>

        {/* Mode Filter */}
        <div className="sm:w-40">
          <select
            id="event-mode-filter"
            value={mode || 'All'}
            onChange={(e) => updateFilter('mode', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-navy-900 text-gray-700 dark:text-gray-200 cursor-pointer transition-all"
          >
            {EVENT_MODES.map((m) => (
              <option key={m} value={m === 'All' ? 'all' : m} className="bg-white dark:bg-navy-900 text-gray-900 dark:text-gray-100">{m === 'All' ? 'All Modes' : m}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
