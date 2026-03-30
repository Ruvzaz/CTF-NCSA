import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";
import { EventStatusFilter } from "@/components/EventStatusFilter";
import { ModernContentCard } from "@/components/ModernContentCard";

export const dynamic = 'force-dynamic';

export default async function EventsPage({ searchParams }: { searchParams: { q?: string; page?: string; status?: string } }) {
  const query = searchParams?.q || '';
  const page = searchParams?.page || '1';
  const status = searchParams?.status || 'upcoming';

  let events: any[] = [];
  let totalPages = 0;
  
  try {
    const filters: Record<string, string> = {
      'pagination[page]': page,
      'pagination[pageSize]': '9',
      'populate': '*',
    };
    
    if (query) {
      filters['filters[title][$containsi]'] = query;
    }

    // ISO timestamp for date filtering
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
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="font-space text-3xl font-bold text-foreground shrink-0">Events & Challenges</h1>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-64">
            <SearchInput placeholder="Search events..." />
          </div>
          <EventStatusFilter />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground/80 col-span-full text-center py-12">No events found matching your criteria.</p>
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
                  description: event.description || "View details and participate in this event.",
                  category: event.type || "Event",
                  date: event.startDate,
                  href: `/events/${event.slug}`,
                  coverImage: imageUrl,
                  categoryColorClass: event.type === 'Jeopardy' ? 'border-secondary/50 text-secondary' : 'border-accent/50 text-accent'
                }}
              />
            );
          })
        )}
      </div>

      <PaginationControl totalPages={totalPages} />
    </div>
  );
}
