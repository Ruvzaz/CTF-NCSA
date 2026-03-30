import { fetchApi } from "@/lib/api";
import { MainCarousel, CarouselItem } from "@/components/MainCarousel";
import { ModernContentCard, ModernContentCardProps } from "@/components/ModernContentCard";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Megaphone, Calendar, FileText, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  let allContent: any[] = [];
  
  try {
    // 1. Fetch data from News, Events, and Writeups in parallel
    const [newsRes, eventsRes, writeupsRes]: any = await Promise.all([
      fetchApi('/newses', { populate: '*', sort: 'publishedAt:desc', pagination: { limit: 10 } }),
      fetchApi('/events', { populate: '*', sort: 'createdAt:desc', pagination: { limit: 10 } }),
      fetchApi('/writeups', { populate: '*', sort: 'createdAt:desc', pagination: { limit: 10 } }),
    ]);

    // 2. Normalize data for the Unified Feed
    const news = (newsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'news',
      timestamp: new Date(item.publishedAt || item.createdAt).getTime(),
    }));

    const events = (eventsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'event',
      timestamp: new Date(item.createdAt).getTime(),
    }));

    const writeups = (writeupsRes?.data || []).map((item: any) => ({
      ...item,
      contentType: 'writeup',
      timestamp: new Date(item.createdAt).getTime(),
    }));

    // 3. Merge and Sort by date (Latest first)
    allContent = [...news, ...events, ...writeups].sort((a, b) => b.timestamp - a.timestamp);

  } catch (error) {
    console.error("Failed to fetch landing page content:", error);
  }

  // 4. Prepare Carousel Items (Top 5 latest)
  const carouselItems: CarouselItem[] = allContent.slice(0, 5).map(item => {
    const imageUrl = item.image?.url 
      ? (item.image.url.startsWith('http') ? item.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.image.url}`)
      : "/images/ctf-default-cover.jpg";

    let href = "/";
    let category = "Announcement";
    
    if (item.contentType === 'news') {
      href = `/news/${item.slug}`;
      category = item.category?.name || "News";
    } else if (item.contentType === 'event') {
      href = `/events/${item.slug}`;
      category = item.type || "Event";
    } else if (item.contentType === 'writeup') {
      href = `/writeups/${item.slug}`;
      category = "Write-up";
    }

    return {
      id: item.id,
      title: item.title,
      category: category,
      imageUrl: imageUrl,
      href: href,
      type: item.contentType as any
    };
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 md:px-8">
      
      {/* Hero Carousel Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-6 h-6 text-primary animate-pulse" />
          <h2 className="font-space text-2xl font-bold tracking-tight text-foreground uppercase">Featured Content</h2>
        </div>
        <MainCarousel items={carouselItems} />
      </section>

      {/* Unified Feed Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
             <Megaphone className="w-6 h-6 text-primary" />
             <h2 className="font-space text-2xl font-bold tracking-tight text-foreground uppercase">Latest Updates</h2>
          </div>
          <div className="flex gap-2">
             <Badge variant="outline" className="border-primary/20 text-muted-foreground">All Activities</Badge>
          </div>
        </div>

        {allContent.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allContent.map((item) => {
              const imageUrl = item.image?.url 
                ? (item.image.url.startsWith('http') ? item.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${item.image.url}`)
                : null;

              let cardProps: ModernContentCardProps = {
                title: item.title,
                description: item.content || item.description || "Learn more about this update.",
                category: "News",
                date: item.publishedAt || item.createdAt,
                href: "/",
                coverImage: imageUrl
              };

              if (item.contentType === 'news') {
                cardProps.category = item.category?.name || "News";
                cardProps.href = `/news/${item.slug}`;
                cardProps.categoryColorClass = "border-primary/30 text-primary";
              } else if (item.contentType === 'event') {
                cardProps.category = item.type || "Event";
                cardProps.href = `/events/${item.slug}`;
                cardProps.categoryColorClass = "border-secondary/30 text-secondary";
              } else if (item.contentType === 'writeup') {
                cardProps.category = "Write-up";
                cardProps.href = `/writeups/${item.slug}`;
                cardProps.categoryColorClass = "border-accent/30 text-accent";
              }

              return (
                <ModernContentCard key={`${item.contentType}-${item.id}`} item={cardProps} />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-muted/30">
            <p className="text-muted-foreground font-space">Scanning for transmissions... No data found yet.</p>
          </div>
        )}
      </section>

      {/* Quick Access Grid Footer */}
      <section className="mt-20 pt-16 border-t border-border grid gap-8 md:grid-cols-3">
         <Link href="/news" className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all flex flex-col gap-4">
            <Megaphone className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <h3 className="font-space text-xl font-bold">Latest News</h3>
            <p className="text-sm text-muted-foreground">Stay informed with the latest announcements and system updates.</p>
         </Link>
         <Link href="/events" className="group p-6 rounded-xl bg-card border border-border hover:border-secondary/50 transition-all flex flex-col gap-4">
            <Calendar className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
            <h3 className="font-space text-xl font-bold">CTF Events</h3>
            <p className="text-sm text-muted-foreground">Browse upcoming and ongoing capture-the-flag competitions.</p>
         </Link>
         <Link href="/writeups" className="group p-6 rounded-xl bg-card border border-border hover:border-accent/50 transition-all flex flex-col gap-4">
            <FileText className="w-8 h-8 text-accent group-hover:scale-110 transition-transform" />
            <h3 className="font-space text-xl font-bold">Write-ups</h3>
            <p className="text-sm text-muted-foreground">Explore technical solutions and strategies for various challenges.</p>
         </Link>
      </section>
    </div>
  );
}
