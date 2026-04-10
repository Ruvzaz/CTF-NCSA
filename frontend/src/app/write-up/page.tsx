export const dynamic = 'force-dynamic';

import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";
import { ModernContentCard } from "@/components/ModernContentCard";
import { SectionHeader } from "@/components/SectionHeader";
import { FileText } from "lucide-react";

export default async function WriteupsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = searchParams?.q || '';
  const page = searchParams?.page || '1';
  let writeups: any[] = [];
  let totalPages = 0;
  
  try {
    const filters: Record<string, string> = {
      'pagination[page]': page,
      'pagination[pageSize]': '12',
      'populate': '*',
      'sort': 'publishedAt:desc'
    };
    if (query) {
      filters['filters[title][$containsi]'] = query;
    }

    const res: any = await fetchApi('/writeups', filters);
    writeups = res.data || [];
    totalPages = res.meta?.pagination?.pageCount || 0;
  } catch (err) {
    console.error("Failed to fetch writeups:", err);
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-alt border-b border-border py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <SectionHeader 
              prefix="POST_MORTEM_REPORTS"
              title="Technical Write-ups"
              subtitle="Detailed deconstruction of historical challenges and strategic solutions used by elite agents."
              className="mb-0"
            />
            <div className="w-full md:w-80">
              <SearchInput placeholder="SEARCH ARCHIVE..." />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {writeups.length === 0 ? (
            <div className="col-span-full py-32 border-2 border-dashed border-border bg-white flex flex-col items-center">
              <FileText size={48} className="text-muted-foreground mb-4 opacity-20" />
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
                Scanning for historical archives... No records retrieved.
              </p>
            </div>
          ) : writeups.map((w: any) => {
             const imageUrl = w.image?.url 
                ? (w.image.url.startsWith('http') ? w.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${w.image.url}`)
                : null;

             return (
               <ModernContentCard 
                 key={w.id}
                 item={{
                   title: w.title,
                   description: `Mission Deconstruction by Agent ${w.author || 'UNKNOWN'}. Read techniques and strategies.`,
                   category: w.category?.name || "Write-up",
                   date: w.publishedAt || w.createdAt,
                   href: `/write-up/${w.id}`,
                   coverImage: imageUrl
                 }}
               />
             );
          })}
        </div>

        <div className="mt-16 flex justify-center">
          <PaginationControl totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
