import { NextRequest, NextResponse } from 'next/server';
import { getEvents } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') ?? undefined;
    const mode = searchParams.get('mode') ?? undefined;
    const tag = searchParams.get('tag') ?? undefined;
    const search = searchParams.get('search')?.toLowerCase();

    const events = await getEvents({ type, mode, tag, search });

    return NextResponse.json({ events });
  } catch (err) {
    console.error('[events]', err);
    return NextResponse.json({ error: 'Failed to load events.' }, { status: 500 });
  }
}
