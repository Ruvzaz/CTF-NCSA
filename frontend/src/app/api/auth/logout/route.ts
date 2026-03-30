import { NextResponse } from 'next/server';

/**
 * POST /api/auth/logout
 * Clears the JWT HttpOnly cookie
 */
export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('jwt', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
