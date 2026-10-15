import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getSubmissionById, getCertifications, getCategoriesByIds } from '@/lib/db';
import type { SubmissionResult } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const submission = await getSubmissionById(params.id, userId);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    const topCategoryIds = submission.topCategoryIds && submission.topCategoryIds.length > 0
      ? submission.topCategoryIds
      : ['web-software-dev'];

    const certifications = await getCertifications(topCategoryIds);
    const categories = await getCategoriesByIds(topCategoryIds);

    const result: SubmissionResult = {
      submissionId: submission.id,
      topCategoryIds,
      scores: submission.scores ?? {},
      certifications: certifications ?? [],
      categories: categories ?? [],
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[submissions/id]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
