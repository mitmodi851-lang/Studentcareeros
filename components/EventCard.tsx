import Link from 'next/link';
import type { CareerEvent } from '@/types';

const TYPE_COLORS: Record<string, string> = {
  Hackathon: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  'AI Summit': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  Workshop: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  Competition: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  Webinar: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
};

const MODE_COLORS: Record<string, string> = {
  Online: 'bg-green-50 text-green-600 dark:bg-green-950/50 dark:text-green-300',
  Offline: 'bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300',
  Hybrid: 'bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-300',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

interface EventCardProps {
  event: CareerEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
      {/* Card Header */}
      <div className="p-5 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TYPE_COLORS[event.type] ?? 'bg-gray-100 text-gray-600 dark:bg-navy-900 dark:text-gray-300'}`}>
            {event.type}
          </span>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${MODE_COLORS[event.mode] ?? 'bg-gray-50 text-gray-500 dark:bg-navy-900 dark:text-gray-400'}`}>
            {event.mode}
          </span>
        </div>

        <h3 className="text-base font-semibold text-navy-900 dark:text-white mb-1.5 leading-snug line-clamp-2">
          {event.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{event.organizer}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="px-5 pb-5 flex items-center gap-2">
        <Link
          href={`/events/${event.id}`}
          className="flex-1 text-center px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-navy-700 rounded-lg border border-primary-200 dark:border-primary-800 transition-colors"
        >
          View Details
        </Link>
        <a
          href={event.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-lg transition-colors"
        >
          Register →
        </a>
      </div>
    </div>
  );
}
