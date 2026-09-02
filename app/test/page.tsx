'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import type { AptitudeQuestion, AnswerEntry } from '@/types';

export default function TestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Protect route — redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/test');
    }
  }, [status, router]);

  // Fetch questions
  useEffect(() => {
    if (status === 'authenticated') {
      async function loadQuestions() {
        try {
          const res = await fetch('/api/questions');
          if (!res.ok) throw new Error('Failed to load aptitude questions.');
          const data = await res.json();
          setQuestions(data.questions ?? []);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An error occurred.');
        } finally {
          setLoading(false);
        }
      }
      loadQuestions();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-500">Loading Aptitude Test…</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-16 text-center">
          <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 p-8 shadow-card">
            <div className="text-4xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-2">Could Not Load Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error || 'No questions available.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              Retry
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const isFirstQuestion = currentIndex === 0;

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === totalQuestions;

  function handleSelectOption(entry: AnswerEntry) {
    setAnswers((prev) => ({
      ...prev,
      [entry.questionId]: entry.optionId,
    }));
  }

  async function handleSubmit() {
    if (!isAllAnswered) return;
    setSubmitting(true);
    setError('');

    try {
      const payloadAnswers: AnswerEntry[] = questions.map((q) => ({
        questionId: q.id,
        optionId: answers[q.id],
      }));

      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit test.');
      }

      const result = await res.json();
      router.push(`/results/${result.submissionId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full mb-3">
            🧠 Aptitude Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 dark:text-white">
            Career Aptitude Test
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Answer honestly — there are no right or wrong choices.
          </p>
        </div>

        {/* Test Card */}
        <div className="bg-white dark:bg-navy-800 rounded-card-lg border border-gray-100 dark:border-gray-800 shadow-card p-6 sm:p-8">
          <ProgressBar current={currentIndex + 1} total={totalQuestions} />

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 text-sm text-red-600 dark:text-red-400">
              ⚠️ {error}
            </div>
          )}

          {/* Current Question */}
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            selectedOptionId={answers[currentQuestion.id]}
            onSelect={handleSelectOption}
          />

          {/* Navigation & Submit Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
              disabled={isFirstQuestion || submitting}
              className={`
                px-5 py-2.5 text-sm font-semibold rounded-xl transition-all
                ${isFirstQuestion
                  ? 'opacity-40 cursor-not-allowed bg-gray-100 dark:bg-navy-900 text-gray-400 dark:text-gray-600'
                  : 'bg-gray-100 dark:bg-navy-900 text-navy-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-navy-700'
                }
              `}
            >
              ← Previous
            </button>

            {isLastQuestion ? (
              <button
                id="submit-test-btn"
                onClick={handleSubmit}
                disabled={!isAllAnswered || submitting}
                className={`
                  px-7 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm
                  ${!isAllAnswered || submitting
                    ? 'opacity-50 cursor-not-allowed bg-gray-300 dark:bg-navy-900 text-gray-600 dark:text-gray-500'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }
                `}
              >
                {submitting ? 'Calculating Matches…' : 'See My Results →'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))}
                disabled={!answers[currentQuestion.id]}
                className={`
                  px-6 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm
                  ${!answers[currentQuestion.id]
                    ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-navy-900 text-gray-400 dark:text-gray-500'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }
                `}
              >
                Next →
              </button>
            )}
          </div>

          {/* Unanswered Banner on Last Question */}
          {isLastQuestion && !isAllAnswered && (
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-4">
              ⚠️ Please answer all 10 questions before viewing results ({answeredCount}/10 answered).
            </p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
