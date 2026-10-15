import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserCoursePrerequisites, saveUserCoursePrerequisites } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const savePrereqSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  completedIds: z.array(z.string()),
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ completedIds: [] });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) {
      return NextResponse.json({ error: 'courseId parameter is required.' }, { status: 400 });
    }

    const completedIds = await getUserCoursePrerequisites(session.user.id, courseId);
    return NextResponse.json({ completedIds });
  } catch (err) {
    console.error('[prerequisites-get]', err);
    return NextResponse.json({ error: 'Failed to fetch course prerequisites.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required to save prerequisites progress.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = savePrereqSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { courseId, completedIds } = parsed.data;
    const result = await saveUserCoursePrerequisites(session.user.id, courseId, completedIds);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[prerequisites-post]', err);
    return NextResponse.json({ error: 'Failed to save prerequisites progress.' }, { status: 500 });
  }
}
