import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type ModernContentCardProps = {
  title: string;
  description: string;
  category: string;
  date: string;
  href: string;
  coverImage?: string | null;
  categoryColorClass?: string;
};

export function ModernContentCard({ item }: { item: ModernContentCardProps }) {
  const defaultImage = "/images/ctf-default-cover.jpg";
  const imageUrl = item.coverImage || defaultImage;

  return (
    <Link href={item.href} className="block h-full">
      <Card className="group relative overflow-hidden h-full rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] flex flex-col">
        
        {/* Image Wrapper */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badge Overlay */}
          <div className="absolute top-3 right-3 z-10">
            <Badge className={`bg-background/80 text-primary backdrop-blur-sm border border-primary/20 hover:bg-background/90 ${item.categoryColorClass || ''}`}>
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Text Content */}
        <CardContent className="p-5 flex flex-col gap-3 flex-1">
          <div className="text-xs text-muted-foreground/60 font-mono tracking-wider">
            {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          
          <h3 className="font-space text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-2 leading-tight">
            {item.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
