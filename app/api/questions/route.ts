import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getQuestions } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const questions = await getQuestions();

    return NextResponse.json({ questions });
  } catch (err) {
    console.error('[questions]', err);
    return NextResponse.json({ error: 'Failed to load questions.' }, { status: 500 });
  }
}
