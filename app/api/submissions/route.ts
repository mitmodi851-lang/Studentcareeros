import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { getQuestions, getCertifications, getCategoriesByIds, saveSubmission } from '@/lib/db';
import type { SubmissionResult } from '@/types';

export const dynamic = 'force-dynamic';

const answerSchema = z.object({
  questionId: z.string().min(1),
  optionId: z.string().min(1),
});

const submissionSchema = z.object({
  answers: z.array(answerSchema).length(10, 'Exactly 10 answers are required.'),
});

export async function POST(req: NextRequest) {
  try {
    // ── 1. Authenticate — always get userId from session, never trust client ──
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }
    const userId = session.user.id;

    // ── 2. Validate request body ──────────────────────────────────────────────
    const body = await req.json();
    const parsed = submissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }
    const { answers } = parsed.data;

    // ── 3. Fetch questions & map categories ───────────────────────────────────
    const questions = await getQuestions();
    const questionMap: Record<string, Record<string, string>> = {};
    for (const q of questions) {
      const optionMap: Record<string, string> = {};
      for (const opt of q.options ?? []) {
        optionMap[opt.id] = opt.categoryId;
      }
      questionMap[q.id] = optionMap;
    }

    // ── 4. Compute scores per category ───────────────────────────────────────
    const scores: Record<string, number> = {};
    for (const { questionId, optionId } of answers) {
      const catId = questionMap[questionId]?.[optionId];
      if (catId) {
        scores[catId] = (scores[catId] ?? 0) + 1;
      }
    }

    // ── 5. Determine top category/categories (within 1 point of max) ─────────
    const maxScore = Math.max(...Object.values(scores), 0);
    const topCategoryIds = Object.entries(scores)
      .filter(([, score]) => score >= maxScore - 1 && score > 0)
      .map(([id]) => id);

    // ── 6. Fetch matching certifications & categories ─────────────────────────
    const certifications = await getCertifications(topCategoryIds);
    const categories = await getCategoriesByIds(topCategoryIds);

    // ── 7. Save submission ───────────────────────────────────────────────────
    const submissionId = await saveSubmission({
      userId,
      submittedAt: new Date().toISOString(),
      scores,
      topCategoryIds,
      answers,
    });

    const result: SubmissionResult = {
      submissionId,
      topCategoryIds,
      scores,
      certifications,
      categories,
    };

    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error('[submissions]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
