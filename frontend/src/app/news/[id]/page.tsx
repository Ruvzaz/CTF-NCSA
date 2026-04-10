import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
  let newsItem = null;
  
  try {
    const res: any = await fetchApi('/newses', {
      'filters[id][$eq]': params.id,
      populate: '*',
    });
    
    if (res.data && res.data.length > 0) {
      newsItem = res.data[0];
    }
  } catch (err) {
    console.error("Failed to load news detail", err);
  }

  if (!newsItem) {
    return (
      <div className="container mx-auto px-6 py-24 text-center bg-background">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-6">Error: transmission not found in archives.</p>
        <Link href="/news" className="text-primary font-bold hover:underline text-xs tracking-widest uppercase">
          [ ◀ RETURN TO NEWS FEED ]
        </Link>
      </div>
    );
  }

  const imageUrl = newsItem.image?.url 
    ? (newsItem.image.url.startsWith('http') ? newsItem.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${newsItem.image.url}`)
    : "/images/ctf-default-cover.jpg";

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="bg-surface-alt border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link href="/news" className="font-mono text-[10px] text-primary hover:text-accent mb-10 inline-block tracking-widest uppercase font-bold transition-colors">
            ◀ / ARCHIVE / NEWS / {newsItem.category?.name?.toUpperCase() || "ANNOUNCEMENT"}
          </Link>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-[0.3em]">
              // BULLETIN_ID: {newsItem.documentId.substring(0, 8).toUpperCase()}
            </span>
            <h1 className="font-space text-4xl md:text-6xl font-bold text-primary uppercase leading-[0.9] tracking-tighter max-w-4xl">
              {newsItem.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>TIMESTAMP: {new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric', month: '2-digit', day: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>AUTHORITY: {newsItem.author || "AGENCY_ADMIN"}</span>
              </div>
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
                alt={newsItem.title}
                fill
                className="object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
                priority
              />
              <div className="absolute top-0 right-0 p-2">
                 <div className="bg-primary text-white text-[9px] font-mono px-3 py-1 uppercase tracking-widest">
                    RECORDS_SECURED
                 </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none text-text-primary leading-relaxed font-sans prose-headings:font-space prose-headings:uppercase prose-headings:text-primary prose-a:text-accent prose-a:font-bold prose-img:rounded-none prose-img:border-2 prose-img:border-border">
              {newsItem.content ? (
                <MarkdownRenderer content={newsItem.content} />
              ) : (
                <p className="italic text-muted-foreground font-mono text-xs tracking-widest uppercase">
                  No further data available in this log.
                </p>
              )}
            </div>
          </div>

          <aside className="hidden lg:block space-y-8">
            <div className="bg-white border-2 border-border p-6 shadow-sm sticky top-32">
              <h3 className="font-space text-sm font-bold text-primary uppercase tracking-widest mb-4 border-b border-border pb-2">Related Data</h3>
              <p className="font-mono text-[10px] text-muted-foreground leading-relaxed uppercase italic">
                Cross-referencing historical archives for similar subjects. Database sync active...
              </p>
              <div className="mt-8 pt-6 border-t border-border">
                <Link href="/news" className="block text-center border-2 border-primary py-2 font-mono text-[10px] text-primary font-bold hover:bg-primary hover:text-white transition-colors uppercase tracking-widest">
                  [ SCAN ALL LOGS ]
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
