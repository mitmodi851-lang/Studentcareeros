'use client';

import { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { CourseLanguage, TrendingCourse } from '@/types';
import { getTabularCourses } from '@/lib/trendingCoursesData';

const POPULAR_SUBJECTS = [
  { name: 'Cybersecurity', icon: '🛡️' },
  { name: 'Generative AI', icon: '🤖' },
  { name: 'Web Development', icon: '💻' },
  { name: 'Python & DSA', icon: '🐍' },
  { name: 'Data Science', icon: '📊' },
  { name: 'Cloud & DevOps', icon: '☁️' },
];

const LANGUAGES: { label: string; value: CourseLanguage; flag: string }[] = [
  { label: 'All Languages', value: 'All', flag: '🌍' },
  { label: 'English', value: 'English', flag: '🇬🇧' },
  { label: 'Hindi (हिंदी)', value: 'Hindi', flag: '🇮🇳' },
  { label: 'Hinglish', value: 'Hinglish', flag: '🇮🇳' },
];

const PLATFORMS = [
  { label: 'All Platforms', value: 'All', icon: '⚡' },
  { label: 'Google Courses', value: 'Google Course', icon: '🟢' },
  { label: 'YouTube Videos', value: 'YouTube Video', icon: '🔴' },
  { label: 'Certifications', value: 'Certification', icon: '🏆' },
];

const TIERS = [
  { label: 'All Tiers', value: 'All' },
  { label: 'Best Option 👑', value: 'Best' },
  { label: 'Medium Option ⚖️', value: 'Medium' },
  { label: 'New Option 🚀', value: 'New' },
];

export default function CoursesPage() {
  const [query, setQuery] = useState('Cybersecurity');
  const [searchInput, setSearchInput] = useState('Cybersecurity');
  const [languageFilter, setLanguageFilter] = useState<CourseLanguage>('All');
  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [selectedCourseDetails, setSelectedCourseDetails] = useState<TrendingCourse | null>(null);

  const courses = useMemo(() => {
    return getTabularCourses(query, languageFilter, platformFilter, tierFilter);
  }, [query, languageFilter, platformFilter, tierFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(searchInput.trim());
  };

  const handleSubjectPillClick = (subjectName: string) => {
    setSearchInput(subjectName);
    setQuery(subjectName);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/10 to-primary-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold px-3.5 py-1.5 rounded-full mb-3">
            <span>🎓 SUBJECT & COURSE EXPLORER</span>
            <span>·</span>
            <span>Tabular Analysis Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 dark:text-white tracking-tight mb-3">
            Best Google Courses & YouTube Videos
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            Search any subject (e.g., <span className="font-semibold text-primary-600 dark:text-primary-400">Cybersecurity</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">Generative AI</span>, <span className="font-semibold text-primary-600 dark:text-primary-400">Python</span>) and filter by your language (<span className="font-semibold text-emerald-600 dark:text-emerald-400">Hindi, English, Hinglish</span>) to get the best Google courses and YouTube videos presented in an organized tabular format.
          </p>
        </div>

        {/* Search & Subject Selection Bar */}
        <div className="bg-white dark:bg-navy-900 rounded-card-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm mb-8 space-y-5 transition-colors duration-200">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter subject or course (e.g. Cybersecurity, Gen AI, Python, Web Dev...)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-navy-800 text-navy-900 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors shadow-inner"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-base">🔎</span>
            </div>
            <button
              type="submit"
              className="btn-primary px-7 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md shrink-0"
            >
              <span>Search Subject</span>
            </button>
          </form>

          {/* Quick Subject Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Popular Subjects:</span>
            {POPULAR_SUBJECTS.map((subj) => (
              <button
                key={subj.name}
                type="button"
                onClick={() => handleSubjectPillClick(subj.name)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  query.toLowerCase() === subj.name.toLowerCase()
                    ? 'bg-primary-600 text-white border-primary-600 shadow-xs font-semibold'
                    : 'bg-gray-50 dark:bg-navy-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-navy-700'
                }`}
              >
                <span className="mr-1">{subj.icon}</span> {subj.name}
              </button>
            ))}
          </div>

          {/* Multi-Filter Controls Bar */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Language Selector */}
            <div>
              <label className="block text-[11px] font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-2">
                Language:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => setLanguageFilter(lang.value)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                      languageFilter === lang.value
                        ? 'bg-navy-900 text-white dark:bg-white dark:text-navy-900 border-navy-900 dark:border-white font-bold shadow-xs'
                        : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy-700'
                    }`}
                  >
                    <span className="mr-1">{lang.flag}</span> {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Type Selector */}
            <div>
              <label className="block text-[11px] font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-2">
                Platform Type:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PLATFORMS.map((plat) => (
                  <button
                    key={plat.value}
                    type="button"
                    onClick={() => setPlatformFilter(plat.value)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                      platformFilter === plat.value
                        ? 'bg-primary-600 text-white border-primary-600 font-bold shadow-xs'
                        : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy-700'
                    }`}
                  >
                    <span className="mr-1">{plat.icon}</span> {plat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Verdict Tier Selector */}
            <div>
              <label className="block text-[11px] font-bold text-navy-900 dark:text-white uppercase tracking-wider mb-2">
                Verdict Tier:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TIERS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTierFilter(t.value)}
                    className={`text-xs px-2.5 py-1 rounded-md border font-medium transition-all ${
                      tierFilter === t.value
                        ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-xs'
                        : 'bg-white dark:bg-navy-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-navy-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Counter Banner */}
        <div className="flex items-center justify-between mb-4 px-1">
          <p className="text-sm font-semibold text-navy-900 dark:text-white">
            Showing <span className="text-primary-600 dark:text-primary-400">{courses.length}</span> course option{courses.length === 1 ? '' : 's'} for &ldquo;<span className="underline">{query || 'All Subjects'}</span>&rdquo;
          </p>
          <span className="text-xs text-gray-400">Showing in Tabular Form</span>
        </div>

        {/* ── TABULAR FORM ────────────────────────────────────────── */}
        <div className="bg-white dark:bg-navy-900 rounded-card-lg border border-gray-200 dark:border-gray-800 shadow-card-lg overflow-hidden mb-12 transition-colors duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-gray-50/80 dark:bg-navy-800/80 border-b border-gray-200 dark:border-gray-800 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-4 w-12 text-center">#</th>
                  <th className="py-4 px-5">Course / Video Title & Provider</th>
                  <th className="py-4 px-4">Platform Type</th>
                  <th className="py-4 px-4">Language</th>
                  <th className="py-4 px-4">Rating & Learners</th>
                  <th className="py-4 px-4">Duration & Cost</th>
                  <th className="py-4 px-4">Verdict Tier</th>
                  <th className="py-4 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-400">
                      No course or video found matching your selected filters. Try broadening your search!
                    </td>
                  </tr>
                ) : (
                  courses.map((course, idx) => {
                    const isGoogle = course.platformType === 'Google Course' || course.provider.toLowerCase().includes('google');
                    const isYouTube = course.platformType === 'YouTube Video' || course.provider.toLowerCase().includes('youtube');

                    const tierBadgeClass = {
                      Best: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                      Medium: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                      New: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
                    }[course.tier];

                    const platformBadgeClass = isGoogle
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : isYouTube
                      ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-800'
                      : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';

                    const langFlag = course.language === 'Hindi' ? '🇮🇳 Hindi' : course.language === 'Hinglish' ? '🇮🇳 Hinglish' : '🇬🇧 English';

                    return (
                      <tr
                        key={course.id}
                        className="hover:bg-gray-50/70 dark:hover:bg-navy-800/50 transition-colors group cursor-pointer"
                        onClick={() => setSelectedCourseDetails(course)}
                      >
                        {/* Index */}
                        <td className="py-4 px-4 text-center font-bold text-gray-400 group-hover:text-primary-600">
                          {idx + 1}
                        </td>

                        {/* Title & Provider */}
                        <td className="py-4 px-5">
                          <div className="font-bold text-navy-900 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {course.title}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-2">
                            <span>🏢 {course.provider}</span>
                            <span>·</span>
                            <span>Level: {course.level}</span>
                          </div>
                        </td>

                        {/* Platform Type */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${platformBadgeClass}`}>
                            {isGoogle ? '🟢 Google Course' : isYouTube ? '🔴 YouTube Video' : '🏆 Certification'}
                          </span>
                        </td>

                        {/* Language */}
                        <td className="py-4 px-4 font-medium text-navy-900 dark:text-gray-200">
                          {langFlag}
                        </td>

                        {/* Rating & Learners */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-amber-600 dark:text-amber-400">
                            ⭐ {course.rating} / 5.0
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">
                            {course.enrolledCount}
                          </div>
                        </td>

                        {/* Duration & Cost */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-navy-900 dark:text-gray-200">
                            ⏱️ {course.duration}
                          </div>
                          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {course.cost}
                          </div>
                        </td>

                        {/* Verdict Tier */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${tierBadgeClass}`}>
                            {course.tier === 'Best' ? '👑 Best Option' : course.tier === 'Medium' ? '⚖️ Medium Option' : '🚀 New Option'}
                          </span>
                        </td>

                        {/* Action Link */}
                        <td className="py-4 px-4 text-center">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="btn-primary py-1.5 px-3 text-[11px] font-semibold rounded-lg inline-flex items-center gap-1 shadow-sm"
                          >
                            <span>{isYouTube ? 'Watch Now' : 'Enroll Now'}</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal / Detailed View Drawer for clicked course */}
        {selectedCourseDetails && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-navy-900 rounded-card-lg border border-gray-200 dark:border-gray-800 max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setSelectedCourseDetails(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-navy-900 dark:hover:text-white text-xl font-bold p-1"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                  {selectedCourseDetails.platformType || 'Course'}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase">{selectedCourseDetails.provider}</span>
              </div>

              <h2 className="text-2xl font-extrabold text-navy-900 dark:text-white mb-4">
                {selectedCourseDetails.title}
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-6">
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px] uppercase">Language</span>
                  <span className="font-bold text-navy-900 dark:text-white">{selectedCourseDetails.language}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px] uppercase">Rating</span>
                  <span className="font-bold text-amber-600">⭐ {selectedCourseDetails.rating}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px] uppercase">Learners / Views</span>
                  <span className="font-bold text-navy-900 dark:text-white">{selectedCourseDetails.enrolledCount}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-navy-800 border border-gray-100 dark:border-gray-800">
                  <span className="text-gray-400 block text-[10px] uppercase">Cost</span>
                  <span className="font-bold text-emerald-600">{selectedCourseDetails.cost}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <h4 className="font-bold text-navy-900 dark:text-white mb-1">Course Description:</h4>
                  <p>{selectedCourseDetails.description}</p>
                </div>

                <div>
                  <h4 className="font-bold text-navy-900 dark:text-white mb-1">Key Syllabus Highlights:</h4>
                  <ul className="space-y-1 text-xs">
                    {selectedCourseDetails.keyHighlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-lg bg-primary-50 dark:bg-navy-800 border border-primary-100 dark:border-primary-900">
                  <span className="font-bold text-primary-700 dark:text-primary-300 block mb-0.5">💡 Expert Verdict:</span>
                  <p className="text-xs italic text-gray-600 dark:text-gray-400">&ldquo;{selectedCourseDetails.verdictReason}&rdquo;</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setSelectedCourseDetails(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg"
                >
                  Close
                </button>
                <a
                  href={selectedCourseDetails.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <span>Go to Course Link</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
