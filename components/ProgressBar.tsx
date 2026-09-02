interface ProgressBarProps {
  current: number;   // 1-indexed
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Question <span className="text-navy-900 dark:text-white font-semibold">{current}</span> of{' '}
          <span className="text-navy-900 dark:text-white font-semibold">{total}</span>
        </span>
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-navy-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
