import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * §2 Rate Limiting & Anti-Brute Force
 * In-memory rate limiter for Next.js Edge Middleware.
 */

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

const CRITICAL_WINDOW_MS = 15 * 60 * 1000; // 15 mins window for auth & flags
const MAX_CRITICAL_REQUESTS = 10;          // max 10 attempts per 15 mins

// In-memory stores: IP -> { count, resetTime }
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const criticalRateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Array.from(rateLimitStore.entries()).forEach(([key, value]) => {
    if (now > value.resetTime) rateLimitStore.delete(key);
  });
  Array.from(criticalRateLimitStore.entries()).forEach(([key, value]) => {
    if (now > value.resetTime) criticalRateLimitStore.delete(key);
  });
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  const pathname = request.nextUrl.pathname;
  
  // Identify critical endpoints
  const isCritical = pathname.startsWith('/api/auth') || pathname.startsWith('/api/challenges/submit');

  const store = isCritical ? criticalRateLimitStore : rateLimitStore;
  const windowMs = isCritical ? CRITICAL_WINDOW_MS : RATE_LIMIT_WINDOW_MS;
  const maxRequests = isCritical ? MAX_CRITICAL_REQUESTS : MAX_REQUESTS_PER_WINDOW;

  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetTime) {
    // New window for this IP
    store.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    entry.count++;
    if (entry.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)),
          },
        }
      );
    }
  }

  // Redirect auth pages to home if they are "hidden"
  if (pathname === '/login' || pathname === '/register' || pathname === '/profile') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Apply rate limiting to API routes and page routes
export const config = {
  matcher: [
    '/api/:path*',
    '/news/:path*',
    '/events/:path*',
    '/writeups/:path*',
  ],
};
