import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { STRAPI_URL } from '@/lib/api';

/**
 * POST /api/challenges/submit
 * BFF route: Validates flag submission against Strapi
 * Rate limited by middleware (§2)
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get('jwt')?.value;

    if (!jwt) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const { challengeId, flag } = body;

    if (!challengeId || !flag) {
      return NextResponse.json({ error: 'Challenge ID and flag are required' }, { status: 400 });
    }

    // Get current user
    const userRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!userRes.ok) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
    const user = await userRes.json();

    // Check if already solved
    const existingRes = await fetch(
      `${STRAPI_URL}/api/submissions?filters[user][id][$eq]=${user.id}&filters[challenge][id][$eq]=${challengeId}&filters[correct][$eq]=true`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    const existingData = await existingRes.json();
    if (existingData.data && existingData.data.length > 0) {
      return NextResponse.json({ error: 'You have already solved this challenge', alreadySolved: true }, { status: 400 });
    }

    // Get challenge with private flag (using admin/service token would be needed in production)
    // For now, we use a server-side API call with the admin token
    const adminToken = process.env.STRAPI_API_TOKEN;
    const challengeRes = await fetch(
      `${STRAPI_URL}/api/challenges/${challengeId}`,
      { headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {} }
    );
    const challengeData = await challengeRes.json();
    const challenge = challengeData.data;

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    // Compare flags (case-sensitive)
    const isCorrect = flag === challenge.flag;

    // Record submission
    await fetch(`${STRAPI_URL}/api/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        data: {
          user: user.id,
          challenge: challengeId,
          correct: isCorrect,
          submittedFlag: flag,
          pointsAwarded: isCorrect ? challenge.points : 0,
        },
      }),
    });

    if (isCorrect) {
      // Update solve count
      await fetch(`${STRAPI_URL}/api/challenges/${challengeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {}),
        },
        body: JSON.stringify({
          data: {
            solveCount: (challenge.solveCount || 0) + 1,
            firstBlood: challenge.firstBlood || user.username,
          },
        }),
      });

      return NextResponse.json({ correct: true, points: challenge.points });
    }

    return NextResponse.json({ correct: false, error: 'Wrong flag. Try again.' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
