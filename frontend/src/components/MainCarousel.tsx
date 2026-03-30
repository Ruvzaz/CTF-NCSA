'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CarouselItem = {
  id: string | number;
  title: string;
  category: string;
  imageUrl: string;
  href: string;
  type: 'news' | 'event' | 'writeup';
};

interface MainCarouselProps {
  items: CarouselItem[];
}

export function MainCarousel({ items }: MainCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay effect
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border bg-card shadow-2xl mb-12">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {items.map((item, index) => (
            <div key={`${item.type}-${item.id}`} className="flex-[0_0_100%] min-w-0 relative aspect-[21/9] md:aspect-[2.5/1]">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent"></div>
              
              {/* Text Content - Bottom Left */}
              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full max-w-4xl text-left">
                <Badge className="mb-4 bg-primary text-primary-foreground border-none px-3 py-1 uppercase tracking-wider text-[10px] md:text-xs font-bold">
                  {item.category}
                </Badge>
                <Link href={item.href}>
                  <h2 className="font-space text-2xl md:text-5xl font-extrabold text-white tracking-tight hover:text-primary transition-colors cursor-pointer line-clamp-2 md:leading-[1.1]">
                    {item.title}
                  </h2>
                </Link>
                <div className="mt-6 flex gap-4">
                   <Link href={item.href}>
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-6">
                        READ MORE
                      </Button>
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex ? 'bg-primary w-6' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
