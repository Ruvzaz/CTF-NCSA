import { fetchApi } from "@/lib/api";
import { ModernContentCard } from "@/components/ModernContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { Users, LayoutGrid, Flag, TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function ArchiveDashboard() {
  let stats = { users: 0, challenges: 0, submissions: 0 };
  let historicEvents: any[] = [];
  
  const now = new Date().toISOString();

  try {
    // 1. Fetch Global Custom Statistics
    const statsRes: any = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337'}/api/statistics/global`, { cache: 'no-store' });
    if (statsRes.ok) {
        stats = await statsRes.json();
    }

    // 2. Fetch Archived Events (Past Date)
    const eventsRes: any = await fetchApi('/events', {
      'filters[endDate][$lt]': now,
      'sort': 'startDate:desc',
      'populate': '*',
    });
    historicEvents = eventsRes.data || [];
  } catch (error) {
    console.error("Failed to load archive data:", error);
  }

  // --- MOCKED DEMOGRAPHICS DATA (Ready for Strapi integration) ---
  const MOCK_UNIVERSITIES = [
    { name: "Chulalongkorn University", teams: 24, score: 7540 },
    { name: "Kasetsart University", teams: 18, score: 6210 },
    { name: "King Mongkut's Institute of Technology Ladkrabang", teams: 21, score: 5800 },
    { name: "Chiang Mai University", teams: 14, score: 4320 },
    { name: "Mahidol University", teams: 11, score: 3890 },
  ];

  const MOCK_ZONES = [
    { name: "Bangkok Metropolitan", participants: "45%" },
    { name: "Northern Region", participants: "15%" },
    { name: "Northeastern Region", participants: "20%" },
    { name: "Southern Region", participants: "10%" },
    { name: "Eastern Region", participants: "10%" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 🚀 HERO SECTION: Pixel-Formal */}
      <section className="bg-primary text-white py-12 md:py-24 border-b-4 border-accent relative overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-20" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center justify-center w-16 h-16 bg-accent border-2 border-white/20 pixel-corner shadow-lg shadow-accent/20">
             <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="font-space text-4xl md:text-6xl font-bold uppercase tracking-tight text-white mb-4">
            Global Statistics <span className="font-light text-white/70">&</span> Archives
          </h1>
          <p className="font-mono text-xs text-white/50 tracking-[0.2em] uppercase max-w-2xl leading-relaxed">
            SYSTEM-WIDE OPERATIONAL METRICS, HISTORICAL COMPETITION RECORDS, AND NATIONAL CYBERSECURITY DEMOGRAPHICS.
          </p>
        </div>
      </section>

      {/* 📊 SYSTEM KPIs */}
      <section className="container mx-auto px-6 py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border-2 border-border shadow-lg p-8 border-t-8 border-t-primary flex flex-col group">
             <Users className="text-muted-foreground w-10 h-10 mb-6 transition-transform group-hover:scale-110 group-hover:text-primary" />
             <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase font-bold mb-2">Total Registered Personnel</span>
             <h2 className="font-space text-5xl font-extrabold text-primary tracking-tighter">{stats.users.toLocaleString()}</h2>
          </div>
          <div className="bg-white border-2 border-border shadow-lg p-8 border-t-8 border-t-accent flex flex-col group">
             <LayoutGrid className="text-muted-foreground w-10 h-10 mb-6 transition-transform group-hover:scale-110 group-hover:text-accent" />
             <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase font-bold mb-2">Total Deployed Challenges</span>
             <h2 className="font-space text-5xl font-extrabold text-primary tracking-tighter">{stats.challenges.toLocaleString()}</h2>
          </div>
          <div className="bg-white border-2 border-border shadow-lg p-8 border-t-8 border-t-green-600 flex flex-col group">
             <Flag className="text-muted-foreground w-10 h-10 mb-6 transition-transform group-hover:scale-110 group-hover:text-green-600" />
             <span className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase font-bold mb-2">System-Wide Captures (Solves)</span>
             <h2 className="font-space text-5xl font-extrabold text-primary tracking-tighter">{stats.submissions.toLocaleString()}</h2>
          </div>
        </div>
      </section>

      {/* 🏁 HISTORICAL OPERATIONS (Past Events) */}
      <section className="bg-surface-alt border-y border-border py-16">
        <div className="container mx-auto px-6">
          <SectionHeader 
             prefix="CLASSIFIED_ARCHIVES" 
             title="Past Operations" 
             subtitle="A historical record of previous national and regional cybersecurity competitions hosted on this network." 
          />
          
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12">
            {historicEvents.length === 0 ? (
              <div className="col-span-full py-20 border-2 border-dashed border-border bg-white flex flex-col items-center">
                <ShieldCheck size={48} className="text-muted-foreground mb-4 opacity-20" />
                <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
                  No historical records found in the database.
                </p>
              </div>
            ) : (
              historicEvents.map((event: any) => {
                const imageUrl = event.image?.url 
                  ? (event.image.url.startsWith('http') ? event.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${event.image.url}`)
                  : null;

                return (
                  <ModernContentCard 
                    key={event.id}
                    item={{
                      title: event.title,
                      description: `This operation concluded on ${new Date(event.endDate).toLocaleDateString()}. Access archive details.`,
                      category: "CONCLUDED",
                      date: event.endDate,
                      href: `/event/${event.id}`,
                      coverImage: imageUrl
                    }}
                  />
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 🎓 DEMOGRAPHICS (MOCKED) */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16">
           
           {/* Academy History */}
           <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-primary">
                 <ShieldCheck className="text-accent w-8 h-8" />
                 <h3 className="font-space text-3xl font-bold text-primary uppercase tracking-tight">Academy History</h3>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase italic mb-6">
                 Top performing educational institutions based on historical competition data.
              </p>
              
              <div className="flex flex-col gap-3">
                 {MOCK_UNIVERSITIES.map((uni, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-white border border-border hover:border-primary transition-colors group">
                       <span className="font-space text-sm font-bold text-primary truncate max-w-[60%]">
                         {idx + 1}. {uni.name}
                       </span>
                       <div className="flex gap-4 font-mono text-[10px] uppercase">
                          <span className="text-muted-foreground"><span className="text-primary font-bold">{uni.teams}</span> Roster</span>
                          <span className="text-accent font-bold tracking-widest">{uni.score} pts</span>
                       </div>
                    </div>
                 ))}
                 <Link href="#" className="font-mono text-[10px] text-primary hover:text-accent tracking-widest uppercase font-bold mt-4">
                    [ VERIFY FULL ACADEMY LISTING ──▶ ]
                 </Link>
              </div>
           </div>

           {/* Regional Zones */}
           <div>
              <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-primary">
                 <MapPin className="text-accent w-8 h-8" />
                 <h3 className="font-space text-3xl font-bold text-primary uppercase tracking-tight">Regional Deployments</h3>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground tracking-widest uppercase italic mb-6">
                 Statistical breakdown of participant origin zones across the national network.
              </p>

              <div className="grid gap-4">
                 {MOCK_ZONES.map((zone, idx) => (
                    <div key={idx} className="space-y-2">
                       <div className="flex justify-between font-mono text-[10px] text-primary uppercase font-bold tracking-widest">
                          <span>{zone.name}</span>
                          <span className="text-accent">{zone.participants}</span>
                       </div>
                       <div className="w-full bg-border h-1.5 overflow-hidden rounded-none">
                          <div className="bg-primary h-full" style={{ width: zone.participants }} />
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>
      </section>

    </div>
  );
}
