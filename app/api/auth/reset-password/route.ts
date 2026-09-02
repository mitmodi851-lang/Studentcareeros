import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { findPasswordResetToken, deletePasswordResetToken, updateUserPassword } from '@/lib/db';

const resetSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    const { token, password } = parsed.data;

    const resetDoc = await findPasswordResetToken(token);
    if (!resetDoc) {
      return NextResponse.json({ error: 'Invalid or expired password reset token.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await updateUserPassword(resetDoc.email, passwordHash);
    await deletePasswordResetToken(token);

    return NextResponse.json({ message: 'Password reset successfully. You can now log in with your new password.' });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
