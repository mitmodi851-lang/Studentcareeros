import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserCourseProgress, upsertCourseProgress, getCertificationById } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateProgressSchema = z.object({
  certification_id: z.string().min(1, 'Certification ID is required'),
  progress: z.number().min(0, 'Progress must be at least 0').max(100, 'Progress cannot exceed 100'),
});

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const userId = session.user.id;
    const progressList = await getUserCourseProgress(userId);

    // Attach certification data to each progress record
    const result = await Promise.all(
      progressList.map(async (item) => {
        const cert = await getCertificationById(item.certification_id);
        return {
          ...item,
          certification: cert || undefined,
        };
      })
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[progress-get]', err);
    return NextResponse.json({ error: 'Failed to fetch course progress.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateProgressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { certification_id, progress } = parsed.data;
    const userId = session.user.id;

    const updatedItem = await upsertCourseProgress(userId, certification_id, progress);
    const cert = await getCertificationById(certification_id);

    return NextResponse.json({
      ...updatedItem,
      certification: cert || undefined,
    });
  } catch (err) {
    console.error('[progress-post]', err);
    return NextResponse.json({ error: 'Failed to update course progress.' }, { status: 500 });
  }
}
