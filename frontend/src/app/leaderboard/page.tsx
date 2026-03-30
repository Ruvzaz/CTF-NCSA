'use client';

import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type LeaderboardEntry = {
  id: number;
  username: string;
  totalPoints: number;
  solveCount: number;
  lastSolve: string;
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        // Fetch all correct submissions grouped by user
        const res: any = await fetchApi('/submissions', {
          'filters[correct][$eq]': 'true',
          populate: 'user,challenge',
          'pagination[pageSize]': '1000',
        });

        const submissions = res.data || [];

        // Aggregate by user
        const userMap = new Map<number, LeaderboardEntry>();
        for (const sub of submissions) {
          const userId = sub.user?.id;
          if (!userId) continue;

          if (!userMap.has(userId)) {
            userMap.set(userId, {
              id: userId,
              username: sub.user.username,
              totalPoints: 0,
              solveCount: 0,
              lastSolve: sub.createdAt || '',
            });
          }
          const entry = userMap.get(userId)!;
          entry.totalPoints += sub.pointsAwarded || 0;
          entry.solveCount += 1;
          if (sub.createdAt > entry.lastSolve) {
            entry.lastSolve = sub.createdAt;
          }
        }

        // Sort by points desc, then by lastSolve asc (earlier is better)
        const sorted = Array.from(userMap.values()).sort((a, b) => {
          if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints;
          return a.lastSolve.localeCompare(b.lastSolve);
        });

        setEntries(sorted);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);

  function timeAgo(dateStr: string) {
    if (!dateStr) return '—';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <h1 className="font-space text-3xl font-bold text-foreground mb-8">Leaderboard</h1>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">No solves recorded yet. Be the first!</p>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 items-end mb-8 md:mb-12">
            {/* 2nd Place */}
            {top3[1] ? (
              <Card className="bg-card border border-border rounded-xl p-2 md:p-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-muted mx-auto mb-1 md:mb-2 flex items-center justify-center text-lg md:text-xl font-bold text-foreground">
                  {top3[1].username.charAt(0).toUpperCase()}
                </div>
                <p className="font-space font-bold text-foreground text-xs md:text-sm truncate px-1">{top3[1].username}</p>
                <p className="text-primary font-space text-sm md:text-lg font-bold truncate">{top3[1].totalPoints.toLocaleString()} <span className="hidden md:inline">pts</span></p>
                <p className="text-muted-foreground mb-1 text-[10px] md:text-xs md:mt-1">🥈 <span className="hidden md:inline">#2</span></p>
              </Card>
            ) : <div />}

            {/* 1st Place */}
            {top3[0] ? (
              <Card className="bg-card border-2 border-primary rounded-xl p-3 md:p-6 text-center scale-105 shadow-[0_0_15px_hsl(160_84%_39%/0.2)] md:shadow-[0_0_20px_hsl(160_84%_39%/0.3)] min-h-[140px] md:min-h-[180px] flex flex-col justify-end">
                <p className="text-xl md:text-2xl mb-1 absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-background rounded-full px-2">👑</p>
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-muted mx-auto mb-1 md:mb-2 flex items-center justify-center text-xl md:text-2xl font-bold text-primary">
                  {top3[0].username.charAt(0).toUpperCase()}
                </div>
                <p className="font-space font-bold text-foreground text-sm md:text-base truncate px-1">{top3[0].username}</p>
                <p className="text-primary font-space text-base md:text-xl font-bold truncate">{top3[0].totalPoints.toLocaleString()} <span className="hidden md:inline">pts</span></p>
                <p className="text-muted-foreground text-[10px] md:text-xs md:mt-1">🥇 <span className="hidden md:inline">#1</span></p>
              </Card>
            ) : <div />}

            {/* 3rd Place */}
            {top3[2] ? (
              <Card className="bg-card border border-border rounded-xl p-2 md:p-4 text-center">
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-muted mx-auto mb-1 md:mb-2 flex items-center justify-center text-lg md:text-xl font-bold text-foreground">
                  {top3[2].username.charAt(0).toUpperCase()}
                </div>
                <p className="font-space font-bold text-foreground text-xs md:text-sm truncate px-1">{top3[2].username}</p>
                <p className="text-primary font-space text-sm md:text-lg font-bold truncate">{top3[2].totalPoints.toLocaleString()} <span className="hidden md:inline">pts</span></p>
                <p className="text-muted-foreground mb-1 text-[10px] md:text-xs md:mt-1">🥉 <span className="hidden md:inline">#3</span></p>
              </Card>
            ) : <div />}
          </div>

          {/* Full Rankings Table */}
          {rest.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Player</th>
                    <th className="px-4 py-3 text-right">Solved</th>
                    <th className="px-4 py-3 text-right">Points</th>
                    <th className="px-4 py-3 text-right">Last Solve</th>
                  </tr>
                </thead>
                <tbody>
                  {rest.map((entry, i) => (
                    <tr key={entry.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-space font-bold">{i + 4}</td>
                      <td className="px-4 py-3 text-foreground">{entry.username}</td>
                      <td className="px-4 py-3 text-right">{entry.solveCount}</td>
                      <td className="px-4 py-3 text-right text-primary font-mono font-semibold">{entry.totalPoints.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground text-xs">{timeAgo(entry.lastSolve)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
