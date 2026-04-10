import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Flag } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export const dynamic = 'force-dynamic';

import { Button } from "@/components/ui/button";

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  let eventItem = null;
  
  try {
    const res: any = await fetchApi('/events', {
      'filters[id][$eq]': params.id,
      populate: '*',
    }, { cache: 'no-store' });
    
    if (res.data && res.data.length > 0) {
      eventItem = res.data[0];
    }
  } catch (err) {
    console.error("Failed to load event detail", err);
  }

  if (!eventItem) {
    return (
      <div className="container mx-auto px-6 py-24 text-center bg-background">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-6">Error: Deployment data missing from archives.</p>
        <Link href="/events" className="text-primary font-bold hover:underline text-xs tracking-widest uppercase">
          [ ◀ RETURN TO MISSION LIST ]
        </Link>
      </div>
    );
  }

  const imageUrl = eventItem.image?.url 
    ? (eventItem.image.url.startsWith('http') ? eventItem.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${eventItem.image.url}`)
    : "/images/ctf-default-cover.jpg";

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="bg-surface-alt border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link href="/events" className="font-mono text-[10px] text-primary hover:text-accent mb-10 inline-block tracking-widest uppercase font-bold transition-colors">
            ◀ / ARCHIVE / MISSIONS / {eventItem.type?.toUpperCase() || "EVENT"}
          </Link>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-[0.3em]">
              // DEPLOYMENT_ID: {eventItem.documentId.substring(0, 8).toUpperCase()}
            </span>
            <h1 className="font-space text-4xl md:text-6xl font-bold text-primary uppercase leading-[0.9] tracking-tighter max-w-4xl">
              {eventItem.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>OPERATIONAL WINDOW: {new Date(eventItem.startDate).toLocaleDateString()} — {new Date(eventItem.endDate).toLocaleDateString()}</span>
              </div>
              {eventItem.registrationLink && (
                <div className="flex items-center gap-2">
                  <span className="text-primary">🔗</span>
                  <a href={eventItem.registrationLink} target="_blank" rel="noopener noreferrer" className="text-primary font-bold hover:underline underline-offset-4">
                    GATEWAY: REGISTER ACCESS
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <article className="container mx-auto px-6 max-w-5xl pt-12">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12">
          
          <div className="space-y-12">
            <div className="relative aspect-[16/9] w-full border-2 border-border shadow-md overflow-hidden bg-muted">
              <Image
                src={imageUrl}
                alt={eventItem.title}
                fill
                className="object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                priority
              />
              <div className="absolute top-0 right-0 p-2">
                 <div className="bg-primary text-white text-[9px] font-mono px-3 py-1 uppercase tracking-widest">
                    MISSION_VISUAL_FEED
                 </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-text-primary leading-relaxed font-sans prose-headings:font-space prose-headings:uppercase prose-headings:text-primary prose-a:text-accent prose-a:font-bold prose-img:rounded-none prose-img:border-2 prose-img:border-border">
              {eventItem.description ? (
                <MarkdownRenderer content={eventItem.description} />
              ) : (
                <p className="italic text-muted-foreground font-mono text-xs tracking-widest uppercase py-8 text-center border border-dashed border-border bg-muted/10">
                  Mission briefing classified or pending upload.
                </p>
              )}
            </div>

            <div className="pt-10 flex border-t border-border">
              <Link href="/challenges" className="w-full sm:w-auto">
                 <Button className="w-full sm:w-auto h-14 px-12 group">
                    <Flag className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                    [ INITIALIZE SQUAD CHALLENGES ]
                 </Button>
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block space-y-8">
            <div className="bg-white border-2 border-border p-6 shadow-sm sticky top-32">
              <h3 className="font-space text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-border pb-2">Status Terminal</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase">Status</span>
                    <span className="font-mono text-[9px] text-green-600 font-bold uppercase tracking-widest">● ACTIVE</span>
                 </div>
                 <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase">Threat</span>
                    <span className="font-mono text-[9px] text-accent font-bold uppercase tracking-widest">CRITICAL</span>
                 </div>
              </div>
              <p className="mt-6 font-mono text-[9px] text-muted-foreground leading-relaxed uppercase italic">
                Cross-referencing historical archives for similar subjects. 
              </p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
