'use client';

import { usePathname } from 'next/navigation';
import { Shield, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/challenge', label: 'CHALLENGES' },
  { href: '/news', label: 'NEWS' },
  { href: '/event', label: 'EVENTS' },
  { href: '/write-up', label: 'WRITE-UPS' },
  { href: '/archive', label: 'ARCHIVES' },
  { href: '/leaderboard', label: 'LEADERBOARD' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-primary border-b-4 border-accent shadow-lg shadow-primary/20">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* LOGO AREA */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center space-x-3 group translate-y-[-2px]">
            <div className="p-1.5 bg-accent text-white pixel-corner">
              <Shield size={22} strokeWidth={2.5} className="image-pixelated" />
            </div>
            <span className="font-space font-bold text-2xl text-white tracking-widest">
              NCSA<span className="text-white/70 font-light">CTF</span>
            </span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-xs font-mono font-medium tracking-[0.2em] transition-all duration-200 
                  ${isLinkActive(link.href) 
                    ? 'text-white border-b-2 border-accent mt-[2px]' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        
        {/* RIGHT AREA: STATUS & AUTH */}
        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 border border-white/20 bg-black/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[10px] text-green-500 tracking-tighter uppercase whitespace-nowrap">
              SYSTEM: SECURE
            </span>
          </div>

          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className="p-2 text-white hover:bg-white/10 transition-colors">
                <Menu size={28} />
              </SheetTrigger>
              <SheetContent side="right" className="bg-primary border-l-4 border-accent w-[300px] p-0">
                <SheetTitle className="sr-only">Access Menu</SheetTitle>
                <div className="flex flex-col h-full bg-pixel-grid-bg">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <span className="font-space font-bold text-xl text-white tracking-widest">MENU</span>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="flex-1 py-4 overflow-y-auto">
                    {NAV_LINKS.map((link) => (
                      <Link 
                        key={link.href}
                        href={link.href} 
                        onClick={() => setIsOpen(false)}
                        className={`block px-8 py-5 text-sm font-mono tracking-widest transition-colors border-l-4
                          ${isLinkActive(link.href)
                            ? 'bg-white/10 text-white border-accent font-bold'
                            : 'text-white/60 border-transparent hover:bg-white/5 hover:text-white'
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="p-6 bg-black/20 border-t border-white/10 italic text-[10px] text-white/40 font-mono text-center">
                    OFFICIAL NCSA CTF ACCESS TERMINAL
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
