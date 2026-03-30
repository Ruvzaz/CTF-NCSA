import { NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/api';

/**
 * POST /api/auth/register
 * BFF route: Registers user via Strapi, sets JWT in HttpOnly cookie
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Call Strapi register endpoint
    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Registration failed' },
        { status: strapiRes.status }
      );
    }

    // Set JWT in HttpOnly cookie (§3 Security Policy)
    const response = NextResponse.json({ user: data.user }, { status: 201 });
    response.cookies.set('jwt', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
