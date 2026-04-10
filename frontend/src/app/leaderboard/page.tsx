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

import { SectionHeader } from '@/components/SectionHeader';
import { Shield, Trophy, Activity, Medal } from 'lucide-react';

/* --- (Types kept as is) --- */

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
    if (mins < 60) return `${mins}M`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}H`;
    const days = Math.floor(hours / 24);
    return `${days}D`;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-accent animate-spin mb-4" />
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Retrieving Global Rankings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-alt border-b border-border py-12 md:py-20">
        <div className="container mx-auto px-6">
          <SectionHeader 
            prefix="OPERATIONAL_REPORTS"
            title="Global Leaderboard"
            subtitle="Real-time performance metrics of all active cybersecurity agents."
          />
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {entries.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-border bg-white flex flex-col items-center">
            <Shield size={48} className="text-muted-foreground mb-4 opacity-20" />
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
              Scanning for active transmissions... No tactical data retrieved.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-16">
            {/* 🏆 TOP 3 PODIUM: Institutional Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* 2nd Place */}
              {top3[1] ? (
                <div className="bg-white border-2 border-border border-t-8 border-t-primary p-8 text-center relative shadow-sm order-2 md:order-1">
                  <span className="absolute top-4 left-4 font-mono text-2xl font-black text-primary/10 tracking-tighter">02</span>
                  <div className="w-16 h-16 bg-primary/5 border-2 border-primary mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-primary">
                    {top3[1].username.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-space font-bold text-primary text-xl uppercase tracking-tight mb-1">{top3[1].username}</p>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-2xl font-bold text-accent">{top3[1].totalPoints.toLocaleString()}</span>
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">TOTAL CREDITS</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex justify-center items-center gap-2">
                    <Medal size={16} className="text-primary/40" />
                    <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">RANK: SILVER</span>
                  </div>
                </div>
              ) : <div className="hidden md:block" />}

              {/* 1st Place */}
              {top3[0] ? (
                <div className="bg-white border-4 border-primary border-t-[12px] border-t-accent p-10 text-center relative shadow-xl scale-105 z-10 order-1 md:order-2">
                  <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 bg-accent text-white px-6 py-1 font-mono text-[10px] font-bold tracking-[0.4em] uppercase">
                    CHAMPION
                  </div>
                  <span className="absolute top-4 left-4 font-mono text-3xl font-black text-primary/10 tracking-tighter">01</span>
                  <div className="w-20 h-20 bg-accent text-white border-4 border-white shadow-[0_0_0_2px_#1A2B6B] mx-auto mb-6 flex items-center justify-center text-3xl font-bold">
                    {top3[0].username.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-space font-bold text-primary text-2xl uppercase tracking-tighter mb-2">{top3[0].username}</p>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-3xl font-bold text-accent">{top3[0].totalPoints.toLocaleString()}</span>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">OFFICIAL SCORE</span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-border flex justify-center items-center gap-2">
                    <Trophy size={20} className="text-accent" />
                    <span className="font-mono text-[11px] text-accent font-bold tracking-[0.4em] uppercase">RANK: PLATINUM</span>
                  </div>
                </div>
              ) : <div />}

              {/* 3rd Place */}
              {top3[2] ? (
                <div className="bg-white border-2 border-border border-t-8 border-t-primary p-8 text-center relative shadow-sm order-3">
                  <span className="absolute top-4 left-4 font-mono text-2xl font-black text-primary/10 tracking-tighter">03</span>
                  <div className="w-16 h-16 bg-primary/5 border-2 border-primary mx-auto mb-6 flex items-center justify-center text-2xl font-bold text-primary">
                    {top3[2].username.charAt(0).toUpperCase()}
                  </div>
                  <p className="font-space font-bold text-primary text-xl uppercase tracking-tight mb-1">{top3[2].username}</p>
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-mono text-2xl font-bold text-accent">{top3[2].totalPoints.toLocaleString()}</span>
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-widest">TOTAL CREDITS</span>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border flex justify-center items-center gap-2">
                    <Medal size={16} className="text-primary/40" />
                    <span className="font-mono text-[10px] text-primary font-bold tracking-widest uppercase">RANK: BRONZE</span>
                  </div>
                </div>
              ) : <div className="hidden md:block" />}
            </div>

            {/* 📊 FULL RANKINGS: Data Terminal Style */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-[0.3em] mb-4">
                <span className="shrink-0 flex items-center gap-2"><Activity size={14} className="text-primary" /> Active Registry (4 - 100)</span>
                <div className="h-px bg-border w-full opacity-50" />
              </div>

              <div className="border-2 border-border bg-white overflow-hidden overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-primary text-white border-b-4 border-accent">
                      <th className="px-6 py-4 font-mono text-[11px] tracking-[0.2em] uppercase">Rank</th>
                      <th className="px-6 py-4 font-mono text-[11px] tracking-[0.2em] uppercase">Agent Designation</th>
                      <th className="px-6 py-4 font-mono text-[11px] tracking-[0.2em] uppercase text-center">Missions</th>
                      <th className="px-6 py-4 font-mono text-[11px] tracking-[0.2em] uppercase text-right">Points</th>
                      <th className="px-6 py-4 font-mono text-[11px] tracking-[0.2em] uppercase text-right">Last Sync</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rest.map((entry, i) => (
                      <tr key={entry.id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-5 font-mono text-sm text-primary font-bold">
                          [ {String(i + 4).padStart(2, '0')} ]
                        </td>
                        <td className="px-6 py-5 font-space font-bold text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                          {entry.username}
                        </td>
                        <td className="px-6 py-5 font-mono text-sm text-center text-text-secondary">
                          {entry.solveCount}
                        </td>
                        <td className="px-6 py-5 font-mono text-base text-right text-accent font-black">
                          {entry.totalPoints.toLocaleString()}
                        </td>
                        <td className="px-6 py-5 font-mono text-[10px] text-right text-muted-foreground uppercase tracking-widest">
                          T - {timeAgo(entry.lastSolve)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
