import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { findUserByEmail, createUser } from '@/lib/db';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // Check for duplicate email
    const existing = await findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Create user document
    const userId = await createUser({
      name,
      email,
      password_hash,
    });

    return NextResponse.json(
      { message: 'Account created successfully.', userId },
      { status: 201 }
    );
  } catch (err) {
    console.error('[signup]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
