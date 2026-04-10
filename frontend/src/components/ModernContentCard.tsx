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
    <Link href={item.href} className="block h-full transition-all duration-200">
      <Card className="group relative h-full rounded-none border-1.5 border-border bg-white border-l-4 border-l-primary transition-all duration-300 hover:border-l-accent hover:shadow-md flex flex-col">
        
        {/* Image Wrapper */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
          />
          
          {/* Badge Overlay */}
          <div className="absolute top-0 right-0 z-10">
            <Badge className="bg-primary text-white text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1 rounded-none border-none">
              {item.category}
            </Badge>
          </div>
        </div>

        {/* Text Content */}
        <CardContent className="p-6 flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              DATE // {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
            </span>
          </div>
          
          <h3 className="font-space text-lg font-bold text-primary transition-colors group-hover:text-accent line-clamp-2 leading-snug uppercase tracking-tight">
            {item.title}
          </h3>
          
          <p className="text-sm text-text-secondary line-clamp-3 font-normal leading-relaxed">
            {item.description}
          </p>

          <div className="mt-auto pt-4 border-t border-border/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-mono text-accent font-bold tracking-tighter">READ ACCESS GRANTED ──▶</span>
          </div>
        </CardContent>
        
        {/* Pixel Accent */}
        <div className="absolute top-0 right-0 w-1 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    </Link>
  );
}
