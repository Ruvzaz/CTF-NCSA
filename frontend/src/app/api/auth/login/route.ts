import { NextResponse } from 'next/server';
import { STRAPI_URL } from '@/lib/api';

/**
 * POST /api/auth/login
 * BFF route: Authenticates via Strapi, sets JWT in HttpOnly cookie
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body;

    const strapiRes = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await strapiRes.json();

    if (!strapiRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set JWT in HttpOnly cookie (§3 Security Policy)
    const response = NextResponse.json({ user: data.user });
    response.cookies.set('jwt', data.jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
