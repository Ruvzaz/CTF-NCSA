'use client';

import { useAuth } from '@/lib/auth-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      {/* Profile Header */}
      <Card className="bg-card border-border rounded-xl p-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-space font-bold text-primary">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-space text-xl font-bold text-foreground">{user.username}</h1>
            <p className="text-muted-foreground text-sm">{user.email}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Challenges Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-space text-primary">0</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-space text-primary">0</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-space text-secondary">—</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Solves */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-space text-lg text-foreground">Recent Solves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-2 text-left">Challenge</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-right">Points</th>
                  <th className="px-4 py-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground/60">
                    No challenges solved yet. Start hacking!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <button onClick={logout} className="text-destructive text-sm hover:underline">
          Logout
        </button>
      </div>
    </div>
  );
}
