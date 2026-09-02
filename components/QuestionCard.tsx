import type { AptitudeQuestion, AnswerEntry } from '@/types';

interface QuestionCardProps {
  question: AptitudeQuestion;
  selectedOptionId: string | undefined;
  onSelect: (answer: AnswerEntry) => void;
}

export default function QuestionCard({ question, selectedOptionId, onSelect }: QuestionCardProps) {
  return (
    <div className="animate-slide-up">
      <h2 className="text-xl font-semibold text-navy-900 dark:text-white mb-6 leading-snug">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const labels = ['A', 'B', 'C', 'D'];

          return (
            <button
              key={option.id}
              onClick={() => onSelect({ questionId: question.id, optionId: option.id })}
              className={`
                w-full text-left px-4 py-4 rounded-card border-2 transition-all duration-150
                flex items-start gap-4 group
                ${isSelected
                  ? 'border-primary-600 dark:border-primary-500 bg-primary-50 dark:bg-primary-950/60 shadow-sm'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-navy-800 hover:border-primary-300 dark:hover:border-primary-500/60 hover:bg-primary-50/40 dark:hover:bg-navy-700'
                }
              `}
              aria-pressed={isSelected}
            >
              {/* Letter Badge */}
              <span
                className={`
                  flex-shrink-0 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors
                  ${isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-navy-900 text-gray-500 dark:text-gray-400 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/40 group-hover:text-primary-600 dark:group-hover:text-primary-300'
                  }
                `}
              >
                {labels[idx] ?? idx + 1}
              </span>

              <span
                className={`text-sm font-medium leading-relaxed ${isSelected ? 'text-primary-800 dark:text-primary-200' : 'text-gray-700 dark:text-gray-200'}`}
              >
                {option.text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
