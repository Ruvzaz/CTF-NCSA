'use client';

import Link from 'next/link';
import { useState } from 'react';
import { UserMenu } from '@/components/UserMenu';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const MobileLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link 
      href={href} 
      onClick={() => setIsOpen(false)}
      className="block py-4 text-lg font-medium text-muted-foreground hover:text-primary transition-colors border-b border-border/50"
    >
      {children}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary tracking-tight">CTF<span className="text-foreground">Portal</span>_</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/news" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              News
            </Link>
            <Link href="/events" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Events
            </Link>
            <Link href="/writeups" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Write-ups
            </Link>
            <Link href="/leaderboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Leaderboard
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* <div className="hidden md:block">
            <UserMenu />
          </div> */}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden p-2 text-muted-foreground hover:text-foreground">
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col h-full mt-6">
                <span className="font-bold text-xl text-primary tracking-tight mb-8">CTF<span className="text-foreground">Portal</span>_</span>
                
                <div className="flex-1 pr-4">
                  <MobileLink href="/news">News</MobileLink>
                  <MobileLink href="/events">Events</MobileLink>
                  <MobileLink href="/writeups">Write-ups</MobileLink>
                  <MobileLink href="/leaderboard">Leaderboard</MobileLink>
                </div>
                
                {/* <div className="pb-8">
                  <UserMenu />
                </div> */}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
