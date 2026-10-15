import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Student Career OS — Your Career Journey, Organized.',
  description:
    'Discover career-building events and find the certifications that match your strengths with Student Career OS.',
};

const FEATURES = [
  {
    icon: '🤝',
    title: 'Teammate Finder',
    description: 'Find compatible peers for upcoming hackathons with skill filters, role preferences, and instant interest requests.',
    href: '/teammates',
  },
  {
    icon: '🧭',
    title: 'Career Path Simulator',
    description: 'Explore 8 technology tracks, calculate your real-time readiness indicator, and compare roadmaps side-by-side.',
    href: '/simulator',
  },
  {
    icon: '📋',
    title: 'Prerequisite Checklists',
    description: 'Master course foundations before you start with course-specific checklists and saved progress per student.',
    href: '/courses',
  },
  {
    icon: '🎯',
    title: 'Aptitude Assessment',
    description: 'A 10-question assessment that pinpoints your strongest technology or career interest track.',
    href: '/test',
  },
  {
    icon: '📅',
    title: 'Event Discovery',
    description: 'Browse hackathons, AI summits, workshops, competitions, and webinars — all in one place.',
    href: '/events',
  },
  {
    icon: '🎓',
    title: 'Smart Course Explorer',
    description: 'Tabular analysis engine comparing top Google courses and YouTube videos in English, Hindi, and Hinglish.',
    href: '/courses',
  },
];

const STATS = [
  { value: '19+', label: 'Upcoming Events' },
  { value: '8', label: 'Career Tracks' },
  { value: '30+', label: 'Certifications' },
  { value: '100%', label: 'Free to Use' },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-white dark:bg-navy-900 pt-16 pb-24 sm:pt-24 sm:pb-32 transition-colors duration-200">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-primary-50 dark:bg-primary-950/20 opacity-60 blur-3xl" />
            <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-sky-50 dark:bg-sky-950/20 opacity-50 blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-950/50 border border-primary-100 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              New events added weekly
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 dark:text-white tracking-tight mb-5 leading-tight">
              Your Career Journey,{' '}
              <span className="text-primary-600 dark:text-primary-400">Organized.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Discover career-building events and find the certifications that match your strengths.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/simulator"
                id="hero-simulator"
                className="btn-primary text-base px-7 py-3.5 rounded-xl shadow-md flex items-center gap-2"
              >
                <span>🧭 Career Simulator</span>
              </Link>
              <Link
                href="/teammates"
                id="hero-find-teammates"
                className="btn-outline text-base px-7 py-3.5 rounded-xl flex items-center gap-2"
              >
                <span>🤝 Find Teammates</span>
              </Link>
              <Link
                href="/events"
                id="hero-explore-events"
                className="px-6 py-3.5 text-base font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl"
              >
                Explore Events →
              </Link>
            </div>

            {/* Social Proof */}
            <p className="mt-8 text-xs text-gray-400 dark:text-gray-500">
              Free for all students · No credit card required · Built by students
            </p>
          </div>
        </section>

        {/* ── Stats Bar ─────────────────────────────────────────── */}
        <section className="border-y border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-navy-800/60 py-10 transition-colors duration-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-extrabold text-navy-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ─────────────────────────────────────── */}
        <section className="py-20 sm:py-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="section-title mb-4">Everything You Need to Launch Your Career</h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Student Career OS brings together events, teammates, career roadmaps, and course foundations so you can focus on what matters — growing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href || '/'}
                  className="card p-6 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 block group"
                >
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <h3 className="text-base font-semibold text-navy-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex items-center justify-between">
                    <span>{feature.title}</span>
                    <span className="text-xs text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ──────────────────────────────────────── */}
        <section className="py-20 sm:py-28 bg-navy-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                Three simple steps to discover your path and start building credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Explore Events', desc: 'Browse curated hackathons, workshops, and AI summits sorted by date. Filter by type, mode, or keyword.' },
                { step: '02', title: 'Take the Test', desc: 'Answer 10 quick questions about your interests and working style. No wrong answers — it\'s about you.' },
                { step: '03', title: 'Get Your Path', desc: 'Receive a personalized set of certification recommendations matched to your top career interest areas.' },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="text-xs font-bold text-sky-400 mb-2 tracking-widest">{item.step}</div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ────────────────────────────────────────── */}
        <section className="py-20 bg-white dark:bg-navy-900 transition-colors duration-200">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="section-title mb-4">Ready to find your path?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Create your free account in seconds and start exploring events and your aptitude results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup" className="btn-primary text-base px-8 py-3.5 rounded-xl">
                Create Free Account
              </Link>
              <Link href="/events" className="btn-outline text-base px-8 py-3.5 rounded-xl">
                Browse Events
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
