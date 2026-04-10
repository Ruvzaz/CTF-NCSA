export const dynamic = 'force-dynamic';

import { ModernContentCard } from "@/components/ModernContentCard";
import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";
import { EventStatusFilter } from "@/components/EventStatusFilter";
import { SectionHeader } from "@/components/SectionHeader";
import { Calendar } from "lucide-react";

export default async function EventsPage({ searchParams }: { searchParams: { q?: string; page?: string; status?: string } }) {
  const query = searchParams?.q || '';
  const page = searchParams?.page || '1';
  const status = searchParams?.status || 'upcoming';

  let events: any[] = [];
  let totalPages = 0;
  
  try {
    const filters: Record<string, string> = {
      'pagination[page]': page,
      'pagination[pageSize]': '12',
      'populate': '*',
    };
    
    if (query) {
      filters['filters[title][$containsi]'] = query;
    }

    const now = new Date().toISOString();
    if (status === 'upcoming') {
      filters['filters[endDate][$gte]'] = now;
      filters['sort'] = 'startDate:asc';
    } else if (status === 'ended') {
      filters['filters[endDate][$lt]'] = now;
      filters['sort'] = 'startDate:desc';
    }

    const response: any = await fetchApi('/events', filters);
    events = response.data || [];
    totalPages = response.meta?.pagination?.pageCount || 0;
  } catch (error) {
    console.error("Failed to fetch events", error);
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-alt border-b border-border py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <SectionHeader 
              prefix="DEPLOYMENT_SCHEDULE"
              title="Operational Events"
              subtitle="Browse active competitions, security drills, and national cybersecurity exercises."
              className="mb-0"
            />
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="w-full sm:w-64">
                <SearchInput placeholder="SEARCH MISSIONS..." />
              </div>
              <EventStatusFilter />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {events.length === 0 ? (
            <div className="col-span-full py-32 border-2 border-dashed border-border bg-white flex flex-col items-center">
              <Calendar size={48} className="text-muted-foreground mb-4 opacity-20" />
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
                Scanning for active deployments... No logs retrieved.
              </p>
            </div>
          ) : (
            events.map((event: any) => {
              const imageUrl = event.image?.url 
                ? (event.image.url.startsWith('http') ? event.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${event.image.url}`)
                : null;

              return (
                <ModernContentCard 
                  key={event.id}
                  item={{
                    title: event.title,
                    description: event.description || "Official agency competition briefing.",
                    category: event.type || "Event",
                    date: event.startDate,
                    href: `/event/${event.id}`,
                    coverImage: imageUrl
                  }}
                />
              );
            })
          )}
        </div>

        <div className="mt-16 flex justify-center">
          <PaginationControl totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
