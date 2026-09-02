'use client';

import { useState, useMemo } from 'react';
import type { CourseLanguage, TrendingCourse } from '@/types';
import { getCourseTrendAnalysis } from '@/lib/trendingCoursesData';

const POPULAR_SEARCHES = [
  { name: 'Generative AI', icon: '🤖' },
  { name: 'Cybersecurity', icon: '🛡️' },
  { name: 'Full Stack Web Dev', icon: '💻' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Cloud Computing', icon: '☁️' },
  { name: 'Ethical Hacking', icon: '🔓' },
  { name: 'UI/UX Design', icon: '🎨' },
];

const LANGUAGES: { label: string; value: CourseLanguage; flag: string }[] = [
  { label: 'All Languages', value: 'All', flag: '🌍' },
  { label: 'English', value: 'English', flag: '🇬🇧' },
  { label: 'Hindi (हिंदी)', value: 'Hindi', flag: '🇮🇳' },
  { label: 'Hinglish', value: 'Hinglish', flag: '🇮🇳' },
];

function CourseTierCard({ course }: { course: TrendingCourse }) {
  const isBest = course.tier === 'Best';
  const isMedium = course.tier === 'Medium';
  const isNew = course.tier === 'New';

  const badgeConfig = {
    Best: {
      title: 'BEST OPTION',
      subtitle: 'Top-Rated Industry Standard',
      icon: '👑',
      border: 'border-emerald-500/30 dark:border-emerald-500/40',
      bgHeader: 'bg-emerald-50 dark:bg-emerald-950/40',
      badge: 'bg-emerald-600 text-white',
      ring: 'ring-2 ring-emerald-500/20',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
    },
    Medium: {
      title: 'MEDIUM OPTION',
      subtitle: 'Balanced & Practical Choice',
      icon: '⚖️',
      border: 'border-blue-500/30 dark:border-blue-500/40',
      bgHeader: 'bg-blue-50 dark:bg-blue-950/40',
      badge: 'bg-blue-600 text-white',
      ring: 'ring-2 ring-blue-500/20',
      accentColor: 'text-blue-600 dark:text-blue-400',
    },
    New: {
      title: 'NEW OPTION',
      subtitle: '2026 Emerging Hot Trend',
      icon: '🚀',
      border: 'border-purple-500/30 dark:border-purple-500/40',
      bgHeader: 'bg-purple-50 dark:bg-purple-950/40',
      badge: 'bg-purple-600 text-white',
      ring: 'ring-2 ring-purple-500/20',
      accentColor: 'text-purple-600 dark:text-purple-400',
    },
  }[course.tier];

  const langFlag = course.language === 'Hindi' ? '🇮🇳 Hindi' : course.language === 'Hinglish' ? '🇮🇳 Hinglish' : '🇬🇧 English';

  return (
    <div
      className={`card flex flex-col justify-between overflow-hidden border ${badgeConfig.border} ${badgeConfig.ring} transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 relative`}
    >
      {/* Top Banner */}
      <div>
        <div className={`p-4 ${badgeConfig.bgHeader} border-b border-gray-100 dark:border-gray-800 flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xl">{badgeConfig.icon}</span>
            <div>
              <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${badgeConfig.badge}`}>
                {badgeConfig.title}
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-0.5">{badgeConfig.subtitle}</p>
            </div>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 shadow-sm">
            {langFlag}
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{course.provider}</span>
            <h3 className="text-base font-bold text-navy-900 dark:text-white mt-1 leading-snug">
              {course.title}
            </h3>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-navy-800/80 border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase">Rating & Learners</span>
              <span className="font-semibold text-navy-900 dark:text-gray-200">
                ⭐ {course.rating} · {course.enrolledCount}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-gray-50 dark:bg-navy-800/80 border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px] uppercase">Duration & Cost</span>
              <span className="font-semibold text-navy-900 dark:text-gray-200">
                ⏱️ {course.duration}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
            {course.description}
          </p>

          {/* Highlights */}
          <div>
            <h4 className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Key Highlights
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              {course.keyHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Verdict Box */}
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-navy-900/60 border border-dashed border-gray-200 dark:border-gray-700/80">
            <span className={`text-[11px] font-bold ${badgeConfig.accentColor} block mb-0.5`}>
              💡 WHY THIS CHOICE:
            </span>
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              &ldquo;{course.verdictReason}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-5 pt-0">
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full py-2.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Explore Course</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function TrendingCourseSection() {
  const [query, setQuery] = useState('Cybersecurity');
  const [selectedLanguage, setSelectedLanguage] = useState<CourseLanguage>('All');
  const [searchInput, setSearchInput] = useState('Cybersecurity');

  const analysis = useMemo(() => {
    return getCourseTrendAnalysis(query, selectedLanguage);
  }, [query, selectedLanguage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput.trim());
    }
  };

  const handleQuickPillClick = (courseName: string) => {
    setSearchInput(courseName);
    setQuery(courseName);
  };

  return (
    <section className="bg-white dark:bg-navy-900 rounded-card-lg border border-gray-200/80 dark:border-gray-800 p-6 sm:p-8 shadow-card-lg my-10 transition-colors duration-200">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-primary-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-2">
            <span>🔥 NEW FEATURE</span>
            <span>·</span>
            <span>Course Trend Analyzer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white tracking-tight">
            Trending Course Recommendations
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter any topic (e.g., <span className="font-semibold text-primary-600 dark:text-primary-400">Cybersecurity</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">Generative AI</span>) to discover the <span className="text-emerald-600 font-bold">Best</span>, <span className="text-blue-600 font-bold">Medium</span>, and <span className="text-purple-600 font-bold">New</span> course options in your preferred language!
          </p>
        </div>
      </div>

      {/* Controls Form */}
      <form onSubmit={handleSearchSubmit} className="space-y-4 mb-8">
        {/* Search Bar & Language Selector */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search course (e.g. Cybersecurity, Generative AI, Web Dev...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-navy-800 text-navy-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-inner"
            />
            <span className="absolute left-3.5 top-3.5 text-gray-400 text-base">🔍</span>
          </div>

          <button
            type="submit"
            className="btn-primary px-6 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md"
          >
            <span>Analyze Course</span>
          </button>
        </div>

        {/* Quick Search Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-gray-400">Popular Topics:</span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => handleQuickPillClick(item.name)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                query.toLowerCase() === item.name.toLowerCase()
                  ? 'bg-primary-600 text-white border-primary-600 shadow-xs font-semibold'
                  : 'bg-gray-50 dark:bg-navy-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-navy-700'
              }`}
            >
              <span className="mr-1">{item.icon}</span> {item.name}
            </button>
          ))}
        </div>

        {/* Language Selection Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/80">
          <span className="text-xs font-bold text-navy-900 dark:text-white uppercase tracking-wider">
            Preferred Language:
          </span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.value}
                type="button"
                onClick={() => setSelectedLanguage(lang.value)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selectedLanguage === lang.value
                    ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900 border-navy-900 dark:border-white shadow-xs font-bold'
                    : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy-700'
                }`}
              >
                <span className="mr-1">{lang.flag}</span> {lang.label}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Insights Summary Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-primary-50 to-sky-50 dark:from-navy-800 dark:to-navy-800/60 border border-primary-100 dark:border-primary-900/50 mb-8 flex items-center gap-3">
        <div className="text-2xl">⚡</div>
        <div className="text-xs sm:text-sm">
          <span className="font-bold text-navy-900 dark:text-white">Trend Analysis for &ldquo;{query}&rdquo;:</span>{' '}
          <span className="text-gray-600 dark:text-gray-300">{analysis.insightsSummary}</span>
        </div>
      </div>

      {/* 3 Tier Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CourseTierCard course={analysis.bestOption} />
        <CourseTierCard course={analysis.mediumOption} />
        <CourseTierCard course={analysis.newOption} />
      </div>
    </section>
  );
}
