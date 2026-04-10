import { fetchApi } from "@/lib/api";
import { ModernContentCard, ModernContentCardProps } from "@/components/ModernContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Search, Filter, Terminal } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ChallengesPage({ searchParams }: { searchParams: { q?: string, category?: string } }) {
  let challenges: any[] = [];
  let categories: any[] = [];

  try {
    const [challengesRes, categoriesRes]: any = await Promise.all([
      fetchApi('/challenges', { 
        populate: '*',
        'filters[title][$containsi]': searchParams.q || '',
        ...(searchParams.category ? { 'filters[category][name][$eq]': searchParams.category } : {})
      }),
      fetchApi('/categories', { populate: '*' })
    ]);
    
    challenges = challengesRes?.data || [];
    categories = categoriesRes?.data || [];
  } catch (error) {
    console.error("Failed to fetch challenges:", error);
  }

  const difficultyMeter = (diff: string) => {
    const bars = { Easy: "█░░░", Medium: "██░░", Hard: "███░", Insane: "████" };
    return bars[diff as keyof typeof bars] || "░░░░";
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary text-white py-12 md:py-20 border-b-4 border-accent relative overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            prefix="OPERATIONAL_DIRECTORY"
            title="Challenge Archive"
            subtitle="National Cybersecurity Agency official repository of tactical exercises and security drills."
            className="mb-0 text-white"
          />
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">
          
          {/* 🛠️ FILTER PANEL */}
          <aside className="space-y-8">
            <div className="bg-white border-2 border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-primary font-bold font-mono text-xs tracking-widest uppercase">
                <Filter size={14} /> Global Filters
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Search Subject</label>
                  <div className="relative">
                    <Input 
                      placeholder="Keyword..." 
                      className="rounded-none border-border bg-surface-alt font-mono text-xs pl-8 uppercase"
                    />
                    <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={14} />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4 font-bold border-b border-border pb-2">Category</label>
                  <div className="flex flex-col gap-2">
                    <Link 
                      href="/challenge"
                      className={`font-mono text-[11px] px-3 py-2 transition-colors uppercase tracking-widest ${!searchParams.category ? 'bg-primary text-white font-bold' : 'hover:bg-primary/5 text-primary'}`}
                    >
                      [ ALL_DOMAINS ]
                    </Link>
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id}
                        href={`/challenge?category=${cat.name}`}
                        className={`font-mono text-[11px] px-3 py-2 transition-colors uppercase tracking-widest ${searchParams.category === cat.name ? 'bg-primary text-white font-bold' : 'hover:bg-primary/5 text-primary'}`}
                      >
                        [ {cat.name.toUpperCase()} ]
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="bg-primary/5 p-4 border border-primary/10">
                    <p className="font-mono text-[9px] text-primary leading-relaxed uppercase italic">
                      SYSTEM NOTE: AUTHORIZATION LEVEL "EXPERT" REQUIRED FOR INSANE LEVEL THREATS.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* 🏁 CHALLENGE GRID */}
          <main>
            {challenges.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {challenges.map((item) => {
                  const imageUrl = item.image?.url 
                    ? (item.image.url.startsWith('http') ? item.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.image.url}`)
                    : null;

                  return (
                    <Link key={item.id} href={`/challenge/${item.id}`} className="group flex flex-col bg-white border-1.5 border-border border-l-4 border-l-primary hover:border-l-accent transition-all duration-300 shadow-sm hover:shadow-md h-full">
                      <div className="p-6 flex-1 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            // {item.category?.name || 'MISC'}
                          </span>
                          <span className="font-mono text-[10px] text-accent font-bold">
                            [ {difficultyMeter(item.difficulty)} ]
                          </span>
                        </div>
                        
                        <h3 className="font-space text-xl font-bold text-primary group-hover:text-accent transition-colors uppercase tracking-tight">
                          {item.title}
                        </h3>
                        
                        <p className="text-[13px] text-text-secondary line-clamp-2 leading-relaxed font-normal">
                          {item.description}
                        </p>
                        
                        <div className="mt-auto pt-6 border-t border-border/40 flex justify-between items-end">
                          <div className="flex flex-col gap-0.5">
                            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-tighter">REWARD</span>
                            <span className="font-space text-lg font-extrabold text-primary tracking-tighter leading-none">{item.points} pts</span>
                          </div>
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-tighter">SOLVES</span>
                            <span className="font-mono text-xs text-primary font-bold leading-none">{item.solveCount || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-primary group-hover:bg-accent py-2 px-6 flex justify-between items-center transition-colors">
                        <span className="font-mono text-[9px] text-white font-bold tracking-[0.2em] uppercase">ACCESS MISSION ──▶</span>
                        <Terminal size={12} className="text-white/50" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-32 border-2 border-dashed border-border bg-white flex flex-col items-center">
                <Shield size={48} className="text-muted-foreground mb-4 opacity-20" />
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
                  No records found matching your current search parameters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
