import { fetchApi } from "@/lib/api";
import { ModernContentCard, ModernContentCardProps } from "@/components/ModernContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Megaphone, Calendar, FileText, Activity, ShieldCheck, Trophy, Users, Database, Network, Server, Fingerprint, Lock } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let allContent: any[] = [];
  
  try {
    const [newsRes, eventsRes, writeupsRes]: any = await Promise.all([
      fetchApi('/newses', { populate: '*', sort: 'publishedAt:desc', pagination: { limit: 12 } }),
      fetchApi('/events', { populate: '*', sort: 'createdAt:desc', pagination: { limit: 12 } }),
      fetchApi('/writeups', { populate: '*', sort: 'createdAt:desc', pagination: { limit: 12 } }),
    ]);

    const news = (newsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'news',
      timestamp: new Date(item.publishedAt || item.createdAt).getTime(),
    }));

    const events = (eventsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'event',
      timestamp: new Date(item.createdAt).getTime(),
    }));

    const writeups = (writeupsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'writeup',
      timestamp: new Date(item.createdAt).getTime(),
    }));

    allContent = [...news, ...events, ...writeups].sort((a, b) => b.timestamp - a.timestamp);

  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 🚀 HERO SECTION: Pixel-Formal Hero */}
      <section className="relative overflow-hidden bg-background border-b border-border min-h-[calc(100vh-180px)] flex items-center justify-center">
        <div className="absolute inset-0 pixel-grid-bg opacity-100" />
        <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-40" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary font-mono text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase">
              <ShieldCheck size={14} className="flex-shrink-0" /> <span className="text-center sm:text-left">National Cybersecurity mission active</span>
            </div>
            
            <h1 className="font-space text-4xl sm:text-5xl md:text-7xl font-bold text-primary mb-4 md:mb-6 leading-[1.1] md:leading-[0.9] tracking-tighter uppercase whitespace-pre-line">
              Defend. Resolve.{"\n"}
              <span className="text-accent underline decoration-4 underline-offset-8">Capture The Flag.</span>
            </h1>
            
            <p className="font-mono text-[10px] md:text-xs lg:text-sm text-text-secondary uppercase tracking-[0.15em] md:tracking-[0.2em] mb-8 md:mb-10 max-w-2xl leading-relaxed">
              NATIONAL CYBERSECURITY AGENCY (NCSA) — OFFICIAL COMPETITION PLATFORM. 
              EXPOSE VULNERABILITIES, PROTECT INFRASTRUCTURE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto px-8 md:px-10 h-12 md:h-14 text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.25em]">
                [ ▶ ENTER COMPETITION ]
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-8 md:px-10 h-12 md:h-14 text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.25em] bg-white">
                [ VIEW CHALLENGES ]
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 🤝 PARTNER LOGOS: Carousel Mockup */}
      <section className="bg-white border-y border-border overflow-hidden relative py-4 md:py-6">
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="flex w-[200%] animate-marquee">
          {[0, 1].map((i) => (
            <div key={i} className="flex flex-1 justify-around items-center gap-4 opacity-40 grayscale hover:grayscale-0 transition-all duration-300">
              {[
                { Icon: ShieldCheck, label: 'GovSec Info' },
                { Icon: Database,    label: 'Cyber.Data'  },
                { Icon: Network,     label: 'Net_Works'   },
                { Icon: Server,      label: 'Server Host' },
                { Icon: Fingerprint, label: 'Global Ident'},
                { Icon: Lock,        label: 'Secure Vault'},
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
                  <Icon size={20} className="md:hidden" />
                  <Icon size={32} className="hidden md:block" />
                  <span className="font-space font-bold uppercase text-xs md:text-base whitespace-nowrap">{label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 📡 LATEST UPDATES: Unified Feed */}
      <section className="container mx-auto px-6 py-20">
        <SectionHeader 
          prefix="TRANSMISSIONS"
          title="Operational Updates"
          subtitle="Real-time news, events, and technical write-ups from the agency."
        />

        {allContent.length > 0 ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allContent.map((item) => {
              const imageUrl = item.image?.url 
                ? (item.image.url.startsWith('http') ? item.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.image.url}`)
                : null;

              let cardProps: ModernContentCardProps = {
                title: item.title,
                description: item.content || item.description || "Official agency report content.",
                category: "News",
                date: item.publishedAt || item.createdAt,
                href: "/",
                coverImage: imageUrl
              };

              if (item.contentType === 'news') {
                cardProps.category = item.category?.name || "News";
                cardProps.href = `/news/${item.id}`;
              } else if (item.contentType === 'event') {
                cardProps.category = item.type || "Event";
                cardProps.href = `/event/${item.id}`;
              } else if (item.contentType === 'writeup') {
                cardProps.category = "Write-up";
                cardProps.href = `/write-up/${item.id}`;
              }

              return (
                <ModernContentCard key={`${item.contentType}-${item.id}`} item={cardProps} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 border-2 border-dashed border-border bg-white flex flex-col items-center">
            <div className="w-16 h-16 bg-muted mb-6 flex items-center justify-center text-muted-foreground animate-pulse">
              <Megaphone size={32} />
            </div>
            <p className="text-muted-foreground font-mono tracking-widest text-xs uppercase italic">
              Scanning for secure transmissions... No logs detected.
            </p>
          </div>
        )}
      </section>

      {/* 📂 QUICK ACCESS: Categorized Archives */}
      <section className="bg-surface-alt border-y border-border py-20">
        <div className="container mx-auto px-6">
          <SectionHeader 
            prefix="DOCUMENTATION"
            title="Resource Archives"
          />
          <div className="grid gap-8 md:grid-cols-3">
             <Link href="/news" className="group p-8 bg-white border border-border border-l-8 border-l-primary hover:border-l-accent transition-all duration-300 shadow-sm hover:shadow-md">
                <Megaphone className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="font-space text-2xl font-bold mb-4 text-primary uppercase tracking-tight">Intelligence Logs</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">Access official bulletins, system security updates, and agency announcements.</p>
                <span className="font-mono text-[10px] text-accent font-bold tracking-[0.2em]">ACCESS LOGS ──▶</span>
             </Link>
             <Link href="/event" className="group p-8 bg-white border border-border border-l-8 border-l-primary hover:border-l-accent transition-all duration-300 shadow-sm hover:shadow-md">
                <Calendar className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="font-space text-2xl font-bold mb-4 text-primary uppercase tracking-tight">Active Operations</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">Browse ongoing capture-the-flag competitions and upcoming security drills.</p>
                <span className="font-mono text-[10px] text-accent font-bold tracking-[0.2em]">VIEW DEPLOYMENTS ──▶</span>
             </Link>
             <Link href="/write-up" className="group p-8 bg-white border border-border border-l-8 border-l-primary hover:border-l-accent transition-all duration-300 shadow-sm hover:shadow-md">
                <FileText className="w-12 h-12 text-primary mb-6 transition-transform group-hover:scale-110" />
                <h3 className="font-space text-2xl font-bold mb-4 text-primary uppercase tracking-tight">Post-Mortems</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">Technical deconstructions and strategic solutions for historical vulnerabilities.</p>
                <span className="font-mono text-[10px] text-accent font-bold tracking-[0.2em]">OPEN ARCHIVE ──▶</span>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
