import { ModernContentCard } from "@/components/ModernContentCard";
import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";

export const dynamic = 'force-dynamic';

type NewsItem = {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  publishedAt: string;
  image?: { url: string };
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
      'pagination[pageSize]': '9',
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
    <div className="container mx-auto px-4 py-12 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-space text-3xl font-bold text-foreground">Latest News</h1>
        <div className="w-full md:w-1/3">
          <SearchInput placeholder="Search news articles..." />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {newsList.length === 0 ? (
          <p className="text-muted-foreground/80 col-span-full text-center py-12">No news articles found matching your search.</p>
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
                  description: "Read the full news article and stay updated with the latest announcements.",
                  category: "News",
                  date: item.publishedAt,
                  href: `/news/${item.slug}`,
                  coverImage: imageUrl,
                  categoryColorClass: "border-primary/50 text-primary"
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
