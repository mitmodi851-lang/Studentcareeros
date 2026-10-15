import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTeammateRequestById, updateTeammateRequest, deleteTeammateRequest } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateRequestSchema = z.object({
  projectName: z.string().min(2).max(100).optional(),
  preferredRole: z.string().min(2).optional(),
  skills: z.array(z.string()).min(1).optional(),
  description: z.string().min(10).max(1000).optional(),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
  availability: z.string().min(2).optional(),
  collaborationMode: z.enum(['Remote', 'In-Person', 'Hybrid']).optional(),
  status: z.enum(['Open', 'Closed']).optional(),
  teamSize: z.number().min(1).max(20).optional(),
  maxTeamSize: z.number().min(1).max(20).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getTeammateRequestById(params.id);
    if (!item) {
      return NextResponse.json({ error: 'Teammate request not found.' }, { status: 404 });
    }
    return NextResponse.json(item);
  } catch (err) {
    console.error('[teammate-get-one]', err);
    return NextResponse.json({ error: 'Failed to fetch request.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const updated = await updateTeammateRequest(params.id, session.user.id, parsed.data);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error('[teammate-put]', err);
    const message = err instanceof Error ? err.message : 'Failed to update request.';
    const status = message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const success = await deleteTeammateRequest(params.id, session.user.id);
    if (!success) {
      return NextResponse.json({ error: 'Request not found or unauthorized.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Request deleted successfully.' });
  } catch (err: unknown) {
    console.error('[teammate-delete]', err);
    const message = err instanceof Error ? err.message : 'Failed to delete request.';
    const status = message.includes('Unauthorized') ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
