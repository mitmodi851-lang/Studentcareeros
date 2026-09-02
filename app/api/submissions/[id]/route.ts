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
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const submission = await getSubmissionById(params.id, session.user.id);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found or access denied.' }, { status: 404 });
    }

    const certifications = await getCertifications(submission.topCategoryIds);
    const categories = await getCategoriesByIds(submission.topCategoryIds);

    const result: SubmissionResult = {
      submissionId: submission.id,
      topCategoryIds: submission.topCategoryIds,
      scores: submission.scores,
      certifications,
      categories,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error('[submissions/id]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
