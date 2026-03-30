import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Flag } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export const dynamic = 'force-dynamic';

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  let eventItem = null;
  
  try {
    const res: any = await fetchApi('/events', {
      'filters[slug][$eq]': params.slug,
      populate: '*',
    }, { cache: 'no-store' });
    
    if (res.data && res.data.length > 0) {
      eventItem = res.data[0];
    }
  } catch (err) {
    console.error("Failed to load event detail", err);
  }

  if (!eventItem) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold font-space text-foreground mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">The event you are looking for does not exist.</p>
        <Link href="/events" className="text-primary hover:underline">← Back to Events</Link>
      </div>
    );
  }

  const imageUrl = eventItem.image?.url 
    ? (eventItem.image.url.startsWith('http') ? eventItem.image.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${eventItem.image.url}`)
    : "/images/ctf-default-cover.jpg";

  return (
    <article className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/events" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Link>
      </div>

      <div className="max-w-5xl mx-auto relative aspect-[21/9] md:aspect-[2.5/1] w-full overflow-hidden rounded-xl border border-border bg-muted shadow-lg mb-8 md:mb-12">
        <Image
          src={imageUrl}
          alt={eventItem.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
      </div>

      <header className="max-w-3xl mx-auto mb-8 text-center md:text-left">
        <Badge className="mb-4 bg-accent/20 text-accent border-none text-xs md:text-sm px-3 py-1">
          {eventItem.type || "Event"}
        </Badge>
        
        <h1 className="font-space text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-6 leading-tight flex-wrap">
          {eventItem.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground border-b border-border/50 pb-6">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-primary" />
            {new Date(eventItem.startDate).toLocaleDateString()} - {new Date(eventItem.endDate).toLocaleDateString()}
          </div>
          {eventItem.registrationLink && (
            <div className="flex items-center">
              <span className="w-4 h-4 mr-2 text-primary">🔗</span>
              <a href={eventItem.registrationLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Register Here
              </a>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto mb-16">
        {eventItem.description ? (
          <MarkdownRenderer 
            content={eventItem.description} 
            className="prose-primary max-w-none md:px-0 prose-headings:font-space prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border shadow-none" 
          />
        ) : (
          <p className="text-muted-foreground italic text-center py-8">No specific details provided.</p>
        )}
        
        <div className="mt-8 text-center">
          <Link href="/challenges">
             <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center mx-auto">
                <Flag className="w-5 h-5 mr-3" />
                Go to Challenges
             </button>
          </Link>
        </div>
      </div>
    </article>
  );
}
