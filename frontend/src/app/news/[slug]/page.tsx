import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export const dynamic = 'force-dynamic';

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  let newsItem = null;
  
  try {
    const res: any = await fetchApi('/newses', {
      'filters[slug][$eq]': params.slug,
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold font-space text-foreground mb-4">News Not Found</h1>
        <p className="text-muted-foreground mb-8">The article you are looking for does not exist.</p>
        <Link href="/news" className="text-primary hover:underline">← Back to News</Link>
      </div>
    );
  }

  const imageUrl = newsItem.image?.url 
    ? (newsItem.image.url.startsWith('http') ? newsItem.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${newsItem.image.url}`)
    : "/images/ctf-default-cover.jpg";

  return (
    <article className="container mx-auto px-4 py-8 md:py-12">
      
      {/* 1. Back Navigation */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/news" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Link>
      </div>

      {/* 2. Hero Image Section */}
      <div className="max-w-5xl mx-auto relative aspect-[21/9] md:aspect-[2.5/1] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-lg mb-8 md:mb-12">
        <Image
          src={imageUrl}
          alt={newsItem.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
      </div>

      {/* 3. Article Header & Meta */}
      <header className="max-w-3xl mx-auto mb-8 text-center md:text-left">
        <Badge className="mb-4 bg-primary/20 text-primary border-none text-xs md:text-sm px-3 py-1">
          {newsItem.category?.name || "Announcement"}
        </Badge>
        
        <h1 className="font-space text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-tight flex-wrap">
          {newsItem.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground border-b border-border/50 pb-6">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {new Date(newsItem.publishedAt || newsItem.createdAt).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2 text-primary" />
            {newsItem.author || "Admin"}
          </div>
        </div>
      </header>

      {/* 4. Reading Content (Markdown) */}
      <div className="max-w-3xl mx-auto mb-16">
        {newsItem.content ? (
          <MarkdownRenderer 
            content={newsItem.content} 
            className="prose-primary max-w-none md:px-0 prose-headings:font-space prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border shadow-none" 
          />
        ) : (
          <p className="text-muted-foreground italic text-center py-8">No content provided.</p>
        )}
      </div>
    </article>
  );
}
