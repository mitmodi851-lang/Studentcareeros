import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { findUserById, getUserSubmissions } from '@/lib/db';
import type { ProfileData } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await findUserById(userId);

    const name = user?.name || session.user.name || 'Student';
    const email = user?.email || session.user.email || '';

    const submissions = await getUserSubmissions(userId);

    const profile: ProfileData = {
      name,
      email,
      submissions,
    };

    return NextResponse.json(profile);
  } catch (err) {
    console.error('[profile]', err);
    return NextResponse.json({ error: 'Failed to load profile.' }, { status: 500 });
  }
}
