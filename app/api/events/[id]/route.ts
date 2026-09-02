import { NextRequest, NextResponse } from 'next/server';
import { getEventById } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await getEventById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (err) {
    console.error('[events/id]', err);
    return NextResponse.json({ error: 'Failed to load event.' }, { status: 500 });
  }
}
