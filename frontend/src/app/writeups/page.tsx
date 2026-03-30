import { fetchApi } from "@/lib/api";
import { SearchInput } from "@/components/SearchInput";
import { PaginationControl } from "@/components/PaginationControl";
import { ModernContentCard } from "@/components/ModernContentCard";

export const dynamic = 'force-dynamic';

export default async function WriteupsPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = searchParams?.q || '';
  const page = searchParams?.page || '1';
  let writeups: any[] = [];
  let totalPages = 0;
  
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

    const res: any = await fetchApi('/writeups', filters);
    writeups = res.data || [];
    totalPages = res.meta?.pagination?.pageCount || 0;
  } catch (err) {
    console.error("Failed to fetch writeups:", err);
  }

  return (
    <div className="container mx-auto px-4 py-12 md:px-8 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="font-space text-3xl font-bold text-foreground">Community Write-ups</h1>
        <div className="w-full md:w-1/3">
          <SearchInput placeholder="Search write-ups..." />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {writeups.length === 0 ? (
          <p className="text-muted-foreground/80 col-span-full text-center py-12">No write-ups found.</p>
        ) : writeups.map((w: any) => {
           const imageUrl = w.image?.url 
              ? (w.image.url.startsWith('http') ? w.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${w.image.url}`)
              : null;

           return (
             <ModernContentCard 
               key={w.id}
               item={{
                 title: w.title,
                 description: `By ${w.author || 'Anonymous'} | Click to read the full write-up and learn the techniques used.`,
                 category: w.category?.name || "Write-up",
                 date: w.publishedAt || w.createdAt,
                 href: `/writeups/${w.slug}`,
                 coverImage: imageUrl,
                 categoryColorClass: "border-primary/50 text-primary"
               }}
             />
           );
        })}
      </div>

      <PaginationControl totalPages={totalPages} />
    </div>
  );
}
