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
          'filters[slug][$eq]': params.slug as string,
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
  }, [params.slug]);

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
        setFeedback({ type: 'solved', message: 'You already solved this! ✅' });
      } else if (data.correct) {
        setFeedback({ type: 'success', message: `Correct! +${data.points} pts 🎉` });
      } else {
        setFeedback({ type: 'error', message: data.error || 'Wrong flag. Try again.' });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Submission failed. Try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const categoryColors: Record<string, string> = {
    Web: 'bg-secondary/20 text-secondary',
    Crypto: 'bg-accent/20 text-accent',
    Pwn: 'bg-destructive/20 text-destructive',
    Forensics: 'bg-primary/20 text-primary',
    Misc: 'bg-muted text-muted-foreground',
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Loading challenge...</p>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-muted-foreground">Challenge not found.</p>
      </div>
    );
  }

  const catName = challenge.category?.name || 'Misc';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/events" className="text-muted-foreground hover:text-primary text-sm mb-6 inline-block">
        ← Back to Challenges
      </Link>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge className={`border-none ${categoryColors[catName] || categoryColors['Misc']}`}>
              {catName}
            </Badge>
            <CardTitle className="text-xl font-space text-foreground">{challenge.title}</CardTitle>
          </div>
          <span className="font-space text-2xl font-bold text-primary">{challenge.points} pts</span>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Description */}
          {challenge.description && (
            <MarkdownRenderer content={challenge.description} />
          )}

          {/* Hints */}
          {challenge.hints && challenge.hints.length > 0 && (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm font-medium">💡 Hints</p>
              {challenge.hints.map((hint, i) => (
                <details key={i} className="group" open={revealedHints.has(i)}
                  onToggle={() => setRevealedHints(prev => new Set(prev).add(i))}>
                  <summary className="text-muted-foreground cursor-pointer hover:text-foreground text-sm">
                    Hint {i + 1}
                  </summary>
                  <div className="bg-muted/30 rounded-md p-3 text-sm text-foreground mt-1">
                    {hint}
                  </div>
                </details>
              ))}
            </div>
          )}

          <hr className="border-border" />

          {/* Submit Flag */}
          {user ? (
            feedback?.type === 'solved' ? (
              <div className="bg-primary/10 border border-primary/30 text-primary rounded-md p-3 text-sm">
                {feedback.message}
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">🏁 Submit Flag</p>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
                  <Input
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="CTF{enter_flag_here}"
                    className="font-mono bg-muted/50 border-border flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  />
                  <Button type="submit" disabled={submitting} className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
                    {submitting ? 'Checking...' : 'Submit'}
                  </Button>
                </form>
                {feedback && (
                  <div className={`mt-3 rounded-md p-3 text-sm ${
                    feedback.type === 'success'
                      ? 'bg-primary/10 border border-primary/30 text-primary'
                      : 'bg-destructive/10 border border-destructive/30 text-destructive'
                  }`} role="alert">
                    {feedback.message}
                  </div>
                )}
              </div>
            )
          ) : (
            <p className="text-muted-foreground text-sm">
              <Link href="/login" className="text-primary hover:underline">Login</Link> to submit flags.
            </p>
          )}

          {/* Solve Stats */}
          <p className="text-muted-foreground text-xs">
            📊 {challenge.solveCount || 0} solves
            {challenge.firstBlood && ` | First blood: ${challenge.firstBlood}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
