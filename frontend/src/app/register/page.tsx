'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register(form.username, form.email, form.password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push('/profile');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="grid md:grid-cols-2 gap-8 items-center min-h-[70vh]">
        {/* Decorative Side */}
        <div className="hidden md:flex flex-col items-center justify-center text-center">
          <pre className="text-primary/60 text-xs font-mono leading-tight">
{`
   ██████╗████████╗███████╗
  ██╔════╝╚══██╔══╝██╔════╝
  ██║        ██║   █████╗  
  ██║        ██║   ██╔══╝  
  ╚██████╗   ██║   ██║     
   ╚═════╝   ╚═╝   ╚═╝     
`}
          </pre>
          <p className="text-muted-foreground mt-4 max-w-xs">
            Join the community. Solve challenges. Climb the leaderboard.
          </p>
        </div>

        {/* Register Form */}
        <Card className="bg-card border-border max-w-md mx-auto w-full">
          <CardHeader className="text-center">
            <span className="font-bold text-xl text-primary tracking-tight">CTF<span className="text-foreground">Portal</span>_</span>
            <CardTitle className="font-space text-2xl font-bold text-foreground mt-2">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 text-sm mb-4" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="hacker_name" value={form.username}
                  onChange={(e) => setForm({...form, username: e.target.value})}
                  className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="bg-muted/50 border-border" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className="bg-muted/50 border-border pr-10" />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-sm">
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input id="confirm" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={form.confirm}
                  onChange={(e) => setForm({...form, confirm: e.target.value})}
                  className="bg-muted/50 border-border" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                {loading ? 'Creating...' : 'Register'}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
