'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import type { CoursePrerequisite } from '@/types';
import { getPrerequisitesForCourse } from '@/lib/prerequisitesData';

interface PrerequisiteChecklistProps {
  courseId: string;
  courseTitle?: string;
  categoryId?: string;
  courseUrl?: string;
  onContinue?: () => void;
  className?: string;
}

export default function PrerequisiteChecklist({
  courseId,
  courseTitle = '',
  categoryId,
  courseUrl,
  onContinue,
  className = '',
}: PrerequisiteChecklistProps) {
  const { data: session } = useSession();
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const prerequisites: CoursePrerequisite[] = useMemo(() => {
    return getPrerequisitesForCourse(courseId, categoryId, courseTitle);
  }, [courseId, categoryId, courseTitle]);

  // Load completed items from API or localStorage
  useEffect(() => {
    let isMounted = true;

    async function loadPrerequisites() {
      setLoading(true);
      if (session?.user?.id) {
        try {
          const res = await fetch(`/api/prerequisites?courseId=${encodeURIComponent(courseId)}`);
          if (res.ok) {
            const data = await res.json();
            if (isMounted && Array.isArray(data.completedIds)) {
              setCompletedIds(data.completedIds);
              setLoading(false);
              return;
            }
          }
        } catch {
          // fallback to localStorage
        }
      }

      // Guest or API error fallback to localStorage
      try {
        const localKey = `prereq_${courseId}`;
        const stored = localStorage.getItem(localKey);
        if (stored && isMounted) {
          setCompletedIds(JSON.parse(stored));
        }
      } catch {
        // ignore
      }

      if (isMounted) setLoading(false);
    }

    loadPrerequisites();

    return () => {
      isMounted = false;
    };
  }, [courseId, session]);

  const total = prerequisites.length;
  const completedCount = completedIds.filter((id) =>
    prerequisites.some((p) => p.id === id)
  ).length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 100;
  const isFullyPrepared = completedCount === total && total > 0;

  async function handleToggle(id: string) {
    const nextIds = completedIds.includes(id)
      ? completedIds.filter((item) => item !== id)
      : [...completedIds, id];

    setCompletedIds(nextIds);

    // Save to localStorage
    try {
      localStorage.setItem(`prereq_${courseId}`, JSON.stringify(nextIds));
    } catch {
      // ignore
    }

    // If logged in, persist to backend
    if (session?.user?.id) {
      setSaving(true);
      try {
        await fetch('/api/prerequisites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId,
            completedIds: nextIds,
          }),
        });
      } catch (err) {
        console.error('Failed to save prerequisite progress:', err);
      } finally {
        setSaving(false);
      }
    }
  }

  return (
    <div className={`bg-gray-50/70 dark:bg-navy-900/60 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 ${className}`}>
      {/* Header & Progress Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-navy-900 dark:text-white flex items-center gap-1.5">
              <span>📋 Course Prerequisite Checklist</span>
            </span>
            {saving && (
              <span className="text-[10px] text-primary-600 dark:text-primary-400 font-medium animate-pulse">
                Saving...
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Check off what you already know before starting to maximize completion success.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="shrink-0 flex items-center gap-2">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isFullyPrepared
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-300 border-primary-200 dark:border-primary-800'
            }`}
          >
            {completedCount} of {total} completed ({percentage}%)
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all duration-300 rounded-full ${
            isFullyPrepared ? 'bg-emerald-500' : 'bg-primary-600'
          }`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Checklist items */}
      {loading ? (
        <div className="py-4 text-center text-xs text-gray-400">Loading prerequisites...</div>
      ) : (
        <div className="space-y-2.5 mb-5">
          {prerequisites.map((item, idx) => {
            const isChecked = completedIds.includes(item.id);
            return (
              <label
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-150 cursor-pointer select-none ${
                  isChecked
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/50'
                    : 'bg-white dark:bg-navy-800/80 border-gray-200/80 dark:border-gray-700/80 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(item.id)}
                  className="mt-0.5 w-4 h-4 rounded text-primary-600 accent-primary-600 focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        isChecked
                          ? 'text-emerald-900 dark:text-emerald-300 line-through opacity-85'
                          : 'text-navy-900 dark:text-white'
                      }`}
                    >
                      {idx + 1}. {item.title}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-navy-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p
                      className={`text-[11px] mt-0.5 leading-relaxed ${
                        isChecked
                          ? 'text-emerald-700/80 dark:text-emerald-400/70'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      )}

      {/* Helpful Guidance Advice Box */}
      <div
        className={`p-3.5 rounded-xl text-xs mb-4 flex items-start gap-2.5 border ${
          isFullyPrepared
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300'
        }`}
      >
        <span className="text-base shrink-0">{isFullyPrepared ? '🎉' : '💡'}</span>
        <div className="leading-relaxed">
          {isFullyPrepared ? (
            <span>
              <strong>You are fully prepared!</strong> You have checked off all recommended foundational concepts. You are ready to dive in and complete this course with confidence.
            </span>
          ) : (
            <span>
              <strong>Foundations check:</strong> You have {total - completedCount} unchecked prerequisite{total - completedCount > 1 ? 's' : ''}. You can still start anytime, but reviewing the unchecked items will make difficult modules much easier to grasp.
            </span>
          )}
        </div>
      </div>

      {/* Action: Continue to course regardless of completion */}
      {(courseUrl || onContinue) && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">
            * Checklists are for guidance and do not block course access.
          </span>
          {courseUrl ? (
            <a
              href={courseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onContinue}
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue to Course</span>
              <span>↗</span>
            </a>
          ) : (
            <button
              onClick={onContinue}
              className="btn-primary text-xs font-semibold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Continue to Course</span>
              <span>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
