import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import Link from "next/link";

import { User, Calendar } from "lucide-react";

export default async function WriteupDetail({ params }: { params: { id: string } }) {
  let writeup = null;

  try {
    const res: any = await fetchApi('/writeups', {
      'filters[id][$eq]': params.id,
      populate: '*',
    }, { cache: 'no-store' });
    
    if (res.data && res.data.length > 0) {
      writeup = res.data[0];
    }
  } catch (err) {
    console.error(err);
  }

  if (!writeup) {
    return notFound();
  }

  const content = writeup.content || "No content provided.";

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="bg-surface-alt border-b border-border py-8 md:py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link href="/writeups" className="font-mono text-[10px] text-primary hover:text-accent mb-10 inline-block tracking-widest uppercase font-bold transition-colors">
            ◀ / ARCHIVE / WRITEUPS
          </Link>
          
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-[0.3em]">
              // POST_MORTEM_ID: {writeup.id}
            </span>
            <h1 className="font-space text-4xl md:text-5xl font-bold text-primary uppercase leading-tight tracking-tighter">
              {writeup.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                <span>ARCHIVED: {new Date(writeup.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <span>AUTHOR: {writeup.author || 'UNKNOWN_AGENT'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <article className="container mx-auto px-6 max-w-4xl pt-12">
        <div className="prose prose-slate max-w-none text-text-primary leading-relaxed font-sans prose-headings:font-space prose-headings:uppercase prose-headings:text-primary prose-a:text-accent prose-a:font-bold prose-img:rounded-none prose-img:border-2 prose-img:border-border p-8 bg-white border-2 border-border shadow-sm">
          <div className="mb-8 p-4 bg-muted/10 border-l-4 border-primary italic text-sm text-text-secondary">
            OFFICIAL DECONSTRUCTION: This document represents a technical deconstruction of the subject challenge. Access restricted to authorized personnel.
          </div>
          <MarkdownRenderer content={content} />
        </div>
      </article>
    </div>
  );
}
