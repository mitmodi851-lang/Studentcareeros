import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { findUserByEmail, updateUserPassword } from '@/lib/db';

const forgotSchema = z.object({
  email: z.string().email('Invalid email address'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { email, newPassword } = parsed.data;

    // Verify the email belongs to a registered account
    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    // Hash and update the password directly
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await updateUserPassword(email, passwordHash);

    return NextResponse.json({ message: 'Password reset successfully.' });
  } catch (err) {
    console.error('[forgot-password]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
