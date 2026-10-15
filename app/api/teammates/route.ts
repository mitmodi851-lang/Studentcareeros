import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getTeammateRequests, createTeammateRequest } from '@/lib/db';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createRequestSchema = z.object({
  projectName: z.string().min(2, 'Project / Hackathon name is required').max(100),
  preferredRole: z.string().min(2, 'Preferred role is required'),
  skills: z.array(z.string()).min(1, 'Please select at least one skill'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(1000),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  availability: z.string().min(2, 'Availability is required'),
  collaborationMode: z.enum(['Remote', 'In-Person', 'Hybrid']),
  status: z.enum(['Open', 'Closed']).default('Open'),
  teamSize: z.number().min(1).max(20).optional().default(1),
  maxTeamSize: z.number().min(1).max(20).optional().default(4),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get('role') || undefined;
    const skill = searchParams.get('skill') || undefined;
    const search = searchParams.get('search') || undefined;
    const isMine = searchParams.get('mine') === 'true';

    let userId: string | undefined = undefined;
    if (isMine) {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Authentication required for user-specific requests.' }, { status: 401 });
      }
      userId = session.user.id;
    }

    const requests = await getTeammateRequests({ role, skill, search, userId });
    return NextResponse.json(requests);
  } catch (err) {
    console.error('[teammates-get]', err);
    return NextResponse.json({ error: 'Failed to fetch teammate requests.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'You must be signed in to create a teammate request.' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const userName = session.user.name || session.user.email?.split('@')[0] || 'Student Member';

    const newRequest = await createTeammateRequest({
      userId: session.user.id,
      userName,
      projectName: parsed.data.projectName,
      preferredRole: parsed.data.preferredRole,
      skills: parsed.data.skills,
      description: parsed.data.description,
      experienceLevel: parsed.data.experienceLevel,
      availability: parsed.data.availability,
      collaborationMode: parsed.data.collaborationMode,
      status: parsed.data.status,
      teamSize: parsed.data.teamSize,
      maxTeamSize: parsed.data.maxTeamSize,
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err) {
    console.error('[teammates-post]', err);
    return NextResponse.json({ error: 'Failed to create teammate request.' }, { status: 500 });
  }
}
