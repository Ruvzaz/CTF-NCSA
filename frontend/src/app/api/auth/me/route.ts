import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { STRAPI_URL } from '@/lib/api';

/**
 * GET /api/auth/me
 * Returns current user data from Strapi using the JWT cookie
 */
export async function GET() {
  try {
    // Auth disabled intentionally.
    return NextResponse.json({ user: null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
