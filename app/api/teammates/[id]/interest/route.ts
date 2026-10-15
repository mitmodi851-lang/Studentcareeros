import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { toggleTeammateInterest } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to express interest.' }, { status: 401 });
    }

    const updated = await toggleTeammateInterest(params.id, session.user.id);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error('[teammate-interest-post]', err);
    const message = err instanceof Error ? err.message : 'Failed to update interest.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
