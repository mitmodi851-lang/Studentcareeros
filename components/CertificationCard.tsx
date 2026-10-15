'use client';

import { useState } from 'react';
import type { Certification, CourseProgress } from '@/types';
import PrerequisiteChecklist from '@/components/PrerequisiteChecklist';

const LEVEL_STYLES: Record<string, string> = {
  Beginner: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Intermediate: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

const VERDICT_STYLES: Record<string, string> = {
  'Excellent Choice': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Highly Recommended': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Industry Standard': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'Good for Beginners': 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'Advanced Specialization': 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border-purple-200 dark:border-purple-800',
};

interface CertificationCardProps {
  cert: Certification;
  progress?: CourseProgress | null;
  onProgressUpdate?: (certId: string, progress: number) => void;
  isLoggedIn?: boolean;
}

export default function CertificationCard({
  cert,
  progress,
  onProgressUpdate,
  isLoggedIn = false,
}: CertificationCardProps) {
  const [showSlider, setShowSlider] = useState(false);
  const [sliderValue, setSliderValue] = useState(progress?.progress ?? 0);
  const [showPrereqs, setShowPrereqs] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentProgress = progress?.progress ?? 0;
  const status = progress?.status ?? 'Not Started';

  const statusColor =
    status === 'Completed'
      ? 'text-emerald-600 dark:text-emerald-400'
      : status === 'In Progress'
      ? 'text-amber-600 dark:text-amber-400'
      : 'text-gray-400 dark:text-gray-500';

  async function handleStartCourse() {
    if (isLoggedIn && onProgressUpdate && currentProgress === 0) {
      setSaving(true);
      try {
        await onProgressUpdate(cert.id, 0);
      } finally {
        setSaving(false);
      }
    }
    // Open official external certification link directly
    window.open(cert.url, '_blank', 'noopener,noreferrer');
  }

  async function handleSaveProgress() {
    if (!onProgressUpdate) return;
    setSaving(true);
    try {
      await onProgressUpdate(cert.id, sliderValue);
      setShowSlider(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col p-5 relative overflow-hidden">
      {/* Top Bar: Level & Verdict Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${LEVEL_STYLES[cert.level] ?? 'bg-gray-100 text-gray-600'}`}>
          {cert.level}
        </span>

        {cert.recommendationVerdict && (
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${VERDICT_STYLES[cert.recommendationVerdict] || 'bg-gray-100 text-gray-700'}`}>
            {cert.recommendationVerdict}
          </span>
        )}
      </div>

      {/* Course Title & Official Provider Issuer */}
      <div className="mb-2">
        <h3 className="text-base font-bold text-navy-900 dark:text-white leading-snug mb-1">{cert.name}</h3>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400">
          <span>{cert.officialIssuer || cert.provider}</span>
          {cert.rating && (
            <span className="ml-auto text-amber-500 font-bold flex items-center gap-1">
              Rating: {cert.rating}/5
            </span>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">{cert.description}</p>

      {/* Honest Evaluation Box: Good / Bad Suggestion */}
      {(cert.whyGood || cert.watchOut) && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-900/80 rounded-xl border border-gray-100 dark:border-gray-800 text-xs space-y-2">
          {cert.whyGood && (
            <div className="flex items-start gap-1.5 text-emerald-700 dark:text-emerald-400">
              <span className="shrink-0 font-bold">Why Good:</span>
              <span className="leading-snug">{cert.whyGood}</span>
            </div>
          )}
          {cert.watchOut && (
            <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="shrink-0 font-bold">Note:</span>
              <span className="leading-snug">{cert.watchOut}</span>
            </div>
          )}
        </div>
      )}

      {/* Learning Progress Bar (for logged-in users) */}
      {isLoggedIn && currentProgress > 0 && (
        <div className="mb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${statusColor}`}>
              My Learning: {currentProgress}% — {status}
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-navy-900 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                status === 'Completed' ? 'bg-emerald-500' : 'bg-primary-600'
              }`}
              style={{ width: `${currentProgress}%` }}
              role="progressbar"
              aria-valuenow={currentProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      )}

      {/* Update Progress Slider */}
      {showSlider && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-navy-900 rounded-xl border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Update Progress</span>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{sliderValue}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={sliderValue}
            onChange={(e) => setSliderValue(Number(e.target.value))}
            className="w-full h-2 accent-primary-600 cursor-pointer"
            aria-label="Progress percentage"
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleSaveProgress}
              disabled={saving}
              className="flex-1 text-xs font-semibold py-1.5 px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Progress'}
            </button>
            <button
              onClick={() => { setShowSlider(false); setSliderValue(currentProgress); }}
              className="flex-1 text-xs font-semibold py-1.5 px-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Prerequisite Checklist Toggle & Container */}
      <div className="mb-3">
        <button
          type="button"
          onClick={() => setShowPrereqs(!showPrereqs)}
          className="w-full text-center px-3 py-1.5 text-xs font-semibold text-primary-700 dark:text-primary-300 bg-primary-50/70 hover:bg-primary-100 dark:bg-primary-950/40 dark:hover:bg-primary-900/60 border border-primary-200/80 dark:border-primary-800/60 rounded-xl transition-all duration-200 flex items-center justify-between"
          aria-expanded={showPrereqs}
        >
          <span className="flex items-center gap-1.5">
            <span>📋</span>
            <span>Prerequisites Checklist</span>
          </span>
          <span className="text-[10px] font-bold text-primary-500">
            {showPrereqs ? '▲ Hide' : '▼ View'}
          </span>
        </button>

        {showPrereqs && (
          <div className="mt-3">
            <PrerequisiteChecklist
              courseId={cert.id}
              courseTitle={cert.name}
              categoryId={cert.categoryId}
              courseUrl={cert.url}
              onContinue={handleStartCourse}
            />
          </div>
        )}
      </div>

      {/* External Direct Links & CTAs */}
      <div className="mt-auto flex flex-col gap-2 pt-2">
        <a
          href={cert.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleStartCourse}
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-500 rounded-xl shadow-sm transition-all duration-200"
        >
          <span>Open Official Course ({cert.officialIssuer || cert.provider})</span>
          <span className="text-sm">↗</span>
        </a>

        {isLoggedIn && !showSlider && (
          <button
            onClick={() => { setSliderValue(currentProgress); setShowSlider(true); }}
            className="w-full text-center px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-navy-900 border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200"
          >
            {currentProgress === 0 ? 'Track My Progress' : 'Update Progress'}
          </button>
        )}
      </div>
    </div>
  );
}
