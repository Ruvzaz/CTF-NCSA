import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { STRAPI_URL } from '@/lib/api';

/**
 * GET /api/auth/me
 * Returns current user data from Strapi using the JWT cookie
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const strapiRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    if (!strapiRes.ok) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await strapiRes.json();
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
