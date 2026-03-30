'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-sm">
            Login
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
            Register
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/profile" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary">
          {user.username.charAt(0).toUpperCase()}
        </span>
        <span className="hidden md:inline">{user.username}</span>
      </Link>
      <button onClick={logout} className="text-xs text-muted-foreground hover:text-destructive transition-colors">
        Logout
      </button>
    </div>
  );
}
