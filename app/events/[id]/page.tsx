import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getEventById, getEvents } from '@/lib/db';
import type { CareerEvent } from '@/types';

export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const events = await getEvents({});
    return events.map((event) => ({ id: event.id }));
  } catch {
    return [
      { id: 'evt-1' },
      { id: 'evt-2' },
      { id: 'evt-3' },
      { id: 'evt-4' },
      { id: 'evt-5' },
      { id: 'evt-6' },
      { id: 'evt-7' },
      { id: 'evt-8' },
      { id: 'evt-9' },
      { id: 'evt-10' },
      { id: 'evt-11' },
      { id: 'evt-12' },
      { id: 'evt-13' },
      { id: 'evt-14' },
      { id: 'evt-15' },
      { id: 'evt-16' },
    ];
  }
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const TYPE_COLORS: Record<string, string> = {
  Hackathon: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
  'AI Summit': 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  Workshop: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  Competition: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  Webinar: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
};

const MODE_COLORS: Record<string, string> = {
  Online: 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300 border border-green-200 dark:border-green-800',
  Offline: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
  Hybrid: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
};

export default async function EventDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const eventId = resolvedParams?.id;

  let event: CareerEvent | null = null;
  try {
    if (eventId) {
      event = await getEventById(eventId);
    }
  } catch (err) {
    console.error(`[EventDetailPage] Error fetching event ${eventId}:`, err);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Back Link */}
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          ← Back to Events
        </Link>

        {!event ? (
          <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-red-100 dark:border-red-900/50 p-8 text-center">
            <h2 className="text-xl font-semibold text-navy-900 dark:text-white mb-2">Event not found</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              The event you are looking for may have ended or does not exist.
            </p>
            <Link href="/events" className="btn-primary">
              Explore All Events
            </Link>
          </div>
        ) : (
          <article className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8 animate-fade-in">
            {/* Header badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${TYPE_COLORS[event.type] ?? 'bg-gray-100 text-gray-700 dark:bg-navy-900 dark:text-gray-300'}`}>
                {event.type}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${MODE_COLORS[event.mode] ?? 'bg-gray-100 text-gray-700 dark:bg-navy-900 dark:text-gray-300'}`}>
                {event.mode}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white mb-4 leading-tight">
              {event.title}
            </h1>

            {/* Organizer & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50/80 dark:bg-navy-900/80 mb-6 border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xs font-bold">
                  ORG
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">Organizer</div>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">{event.organizer}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center text-xs font-bold">
                  LOC
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">Location / Venue</div>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">{event.location}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold">
                  START
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">Start Date & Time</div>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">
                    {formatDate(event.startDate)} {formatTime(event.startDate) ? `(${formatTime(event.startDate)})` : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">
                  END
                </div>
                <div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">End Date & Time</div>
                  <div className="text-sm font-semibold text-navy-900 dark:text-white">
                    {formatDate(event.endDate)} {formatTime(event.endDate) ? `(${formatTime(event.endDate)})` : ''}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-navy-900 dark:text-white mb-3">About This Event</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Category Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-navy-900 text-gray-600 dark:text-gray-300 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Register CTA */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500">Ready to participate?</span>
                <p className="text-sm font-medium text-navy-900 dark:text-white">Registration is managed on the organizer site.</p>
              </div>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-primary px-8 py-3.5 text-base shadow-md"
              >
                Register for Event ↗
              </a>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
