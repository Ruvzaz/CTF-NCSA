'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { fetchApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { ShieldCheck } from 'lucide-react';

type Challenge = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  points: number;
  difficulty: string;
  category: { name: string } | null;
  hints: string[] | null;
  solveCount: number;
  firstBlood: string | null;
};

export default function ChallengeDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'solved'; message: string } | null>(null);
  const [revealedHints, setRevealedHints] = useState<Set<number>>(new Set());

  useEffect(() => {
    async function load() {
      try {
        const res: any = await fetchApi('/challenges', {
          'filters[id][$eq]': params.id as string,
          populate: '*',
        });
        if (res.data && res.data.length > 0) {
          setChallenge(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load challenge', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim() || !challenge) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge.id, flag: flag.trim() }),
      });
      const data = await res.json();

      if (data.alreadySolved) {
        setFeedback({ type: 'solved', message: 'RECORD VERIFIED: CHALLENGE PREVIOUSLY SOLVED ✅' });
      } else if (data.correct) {
        setFeedback({ type: 'success', message: `VALIDATION SUCCESS: +${data.points} POINTS CREDITED 🎉` });
      } else {
        setFeedback({ type: 'error', message: data.error || 'INVALID TOKEN: FLAG MISMATCH DETECTED.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'COMMUNICATION ERROR: SUBMISSION FAILED.' });
    } finally {
      setSubmitting(false);
    }
  };

  const difficultyMeter = (diff: string) => {
    const bars = { Easy: "█░░░", Medium: "██░░", Hard: "███░", Insane: "████" };
    return bars[diff as keyof typeof bars] || "░░░░";
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-accent animate-spin mb-4" />
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Decrypting Challenge Data...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-6 py-24 text-center">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Error: Subject Not Found in Archive.</p>
        <Link href="/challenges" className="text-accent hover:underline text-xs font-bold mt-4 inline-block tracking-widest uppercase">
          [ ◀ RETURN TO DIRECTORY ]
        </Link>
      </div>
    );
  }

  const catName = challenge.category?.name || 'Misc';

  return (
    <div className="min-h-screen bg-background pixel-grid-bg py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link href="/challenges" className="font-mono text-[10px] text-primary hover:text-accent mb-8 inline-block tracking-widest uppercase font-bold transition-colors">
          ◀ / ARCHIVE / CHALLENGES / {catName.toUpperCase()}
        </Link>

        {/* Challenge Official Document Shell */}
        <div className="bg-white border-2 border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 -mr-12 -mt-12 rotate-45" />

          {/* Header Area */}
          <div className="p-8 md:p-12 border-b-2 border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-[0.3em]">
                  // MISSION ID: {challenge.documentId.substring(0, 8).toUpperCase()}
                </span>
                <h1 className="font-space text-3xl md:text-5xl font-bold text-primary uppercase tracking-tight">
                  {challenge.title}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-space text-4xl font-extrabold text-primary tracking-tighter">
                  {challenge.points}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">CREDITS</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">CATEGORY:</span>
                <span className="text-primary font-bold bg-primary/5 px-2 py-0.5 border border-primary/10">{catName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">THREAT_LEVEL:</span>
                <span className="text-accent font-bold">{difficultyMeter(challenge.difficulty)} {challenge.difficulty}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">SOLVES:</span>
                <span className="text-primary font-bold">{challenge.solveCount || 0}</span>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 md:p-12 space-y-12">
            
            {/* Brief Segment */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                <span className="shrink-0">── CHALLENGE BRIEF ──</span>
                <div className="h-px bg-border w-full opacity-50" />
              </div>
              <div className="prose prose-slate max-w-none text-text-primary leading-relaxed font-sans">
                {challenge.description && (
                  <MarkdownRenderer content={challenge.description} />
                )}
              </div>
            </div>

            {/* Hint Segment */}
            {challenge.hints && challenge.hints.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                  <span className="shrink-0">── AVAILABLE HINTS ──</span>
                  <div className="h-px bg-border w-full opacity-50" />
                </div>
                <div className="grid gap-2">
                  {challenge.hints.map((hint, i) => (
                    <details key={i} className="group border border-border bg-surface-alt rounded-none" open={revealedHints.has(i)}
                      onToggle={() => setRevealedHints(prev => new Set(prev).add(i))}>
                      <summary className="px-4 py-3 font-mono text-[11px] text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors list-none flex items-center justify-between uppercase tracking-widest">
                        <span>[ OPEN HINT {i + 1} // CAUTION: MAY REDUCE SCORE ]</span>
                        <span className="group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="p-4 bg-white border-t border-border font-sans text-sm italic text-text-secondary leading-relaxed">
                        {hint}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Submission Segment */}
            <div className="pt-8 space-y-6">
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
                <span className="shrink-0">── FLAG VALIDATION ──</span>
                <div className="h-px bg-border w-full opacity-50" />
              </div>
              
              {user ? (
                <div className="bg-surface-alt border border-border p-8 relative">
                   <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                     <ShieldCheck size={120} />
                   </div>

                   {feedback?.type === 'solved' ? (
                    <div className="flex items-center gap-4 text-primary font-bold font-mono text-sm border-2 border-primary/50 bg-white p-6 tracking-widest text-center justify-center">
                      <ShieldCheck size={24} /> {feedback.message}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                      <div className="space-y-2">
                        <label className="font-mono text-[10px] text-primary font-bold uppercase tracking-widest">
                          ENTER SECURITY TOKEN (FLAG)
                        </label>
                        <div className="flex flex-col md:flex-row gap-3">
                          <input
                            required
                            value={flag}
                            onChange={(e) => setFlag(e.target.value)}
                            placeholder="NCSA{xxxxxxxxxxxxxxxx}"
                            className="bg-white border-2 border-border focus:border-primary outline-none px-4 py-3 font-mono text-sm flex-1 uppercase tracking-wider placeholder:text-muted-foreground/30 transition-all rounded-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                          />
                          <Button 
                            type="submit" 
                            disabled={submitting} 
                            className="h-auto py-3 px-10"
                          >
                            {submitting ? 'VALIDATING...' : 'VERIFY FLAG'}
                          </Button>
                        </div>
                      </div>

                      {feedback && (
                        <div className={`p-4 font-mono text-[11px] tracking-widest border-l-4 ${
                          feedback.type === 'success'
                            ? 'bg-green-50 border-green-600 text-green-700'
                            : 'bg-red-50 border-accent text-accent'
                        }`} role="alert">
                          {feedback.message}
                        </div>
                      )}
                    </form>
                  )}
                </div>
              ) : (
                <div className="border border-dashed border-border p-12 text-center bg-muted/20">
                    <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
                      AUTHORIZATION REQUIRED. <Link href="/login" className="text-primary font-bold underline hover:no-underline">LOGIN</Link> TO ACCESS VALIDATION PORTAL.
                    </p>
                </div>
              )}
            </div>
            
            {/* Footer Stats */}
            <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center gap-4">
                <span>// LOG_ID: {challenge.id}</span>
                <span>// SOLVE_COUNT: {challenge.solveCount || 0}</span>
                {challenge.firstBlood && (
                  <span className="text-accent font-bold">First Blood: {challenge.firstBlood}</span>
                )}
              </div>
              <div className="text-muted-foreground/50">
                OFFICIAL NCSA CLASSIFIED DATA ⬤
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
