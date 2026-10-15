import Link from 'next/link';
import type { AptitudeSubmission } from '@/types';
import { getCategoryById } from '@/lib/categories';

function formatDate(iso: string) {
  if (!iso) return 'Recent Assessment';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 'Recent Assessment';
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Recent Assessment';
  }
}

interface SubmissionCardProps {
  submission: AptitudeSubmission;
}

export default function SubmissionCard({ submission }: SubmissionCardProps) {
  const topIds = submission?.topCategoryIds || (submission as any)?.topCategories || [];
  const validTopIds = Array.isArray(topIds) && topIds.length > 0 ? topIds : ['web-software-dev'];
  const topCategories = validTopIds
    .map((id) => getCategoryById(id))
    .filter((cat): cat is NonNullable<typeof cat> => Boolean(cat && cat.id));

  const categoriesToDisplay = topCategories.length > 0 ? topCategories : [
    {
      id: 'web-software-dev',
      name: 'Web & Software Development',
      description: '',
      icon: '💻',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    }
  ];

  return (
    <div className="bg-white dark:bg-navy-800 rounded-card border border-gray-100 dark:border-gray-800 shadow-card hover:shadow-card-hover transition-all duration-200 p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatDate(submission?.submittedAt)}
          </p>

          <div className="flex flex-wrap gap-2">
            {categoriesToDisplay.map((cat) => (
              <span
                key={cat.id}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${cat.color}`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        <Link
          href={`/results/${submission.id}`}
          className="flex-shrink-0 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-white hover:bg-primary-600 dark:hover:bg-primary-600 border border-primary-200 dark:border-primary-800 hover:border-primary-600 rounded-lg transition-all duration-200 text-center"
        >
          View Results
        </Link>
      </div>
    </div>
  );
}
