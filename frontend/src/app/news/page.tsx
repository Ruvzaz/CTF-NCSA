import { ModernContentCard } from "@/components/ModernContentCard";
import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";
import { SectionHeader } from "@/components/SectionHeader";
import { Megaphone } from "lucide-react";

export const dynamic = 'force-dynamic';

type NewsItem = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: { url: string };
  category?: { name: string };
};

type StrapiResponse<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
};

export default async function NewsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = searchParams?.q || '';
  const page = searchParams?.page || '1';

  let newsResponse: StrapiResponse<NewsItem> = { data: [], meta: { pagination: { page: 1, pageSize: 9, pageCount: 0, total: 0 } } };
  
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

    newsResponse = await fetchApi<StrapiResponse<NewsItem>>('/newses', filters);
  } catch (error) {
    console.error("Failed to fetch news:", error);
  }

  const newsList = newsResponse.data || [];
  const totalPages = newsResponse.meta?.pagination?.pageCount || 0;

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-surface-alt border-b border-border py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 pixel-grid-bg opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <SectionHeader 
              prefix="INTELLIGENCE_LOGS"
              title="Official Bulletins"
              subtitle="Latest announcements, system security updates, and mission briefs from NCSA."
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
          {newsList.length === 0 ? (
            <div className="col-span-full py-32 border-2 border-dashed border-border bg-white flex flex-col items-center">
              <Megaphone size={48} className="text-muted-foreground mb-4 opacity-20" />
              <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase italic">
                Scanning for transmissions... No data retrieved for "{query}".
              </p>
            </div>
          ) : (
            newsList.map((item) => {
              const imageUrl = item.image?.url 
                ? (item.image.url.startsWith('http') ? item.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.image.url}`)
                : null;
                
              return (
                <ModernContentCard 
                  key={item.id}
                  item={{
                    title: item.title,
                    description: "Official agency transmission details. Authorization required for full decryption.",
                    category: "News",
                    date: item.publishedAt,
                    href: `/news/${item.id}`,
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
