'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export function EventStatusFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  const currentStatus = searchParams.get('status') || 'upcoming';

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', status);
    params.set('page', '1');
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex bg-card border border-border rounded-md p-1 shrink-0">
      <button 
        onClick={() => setStatus("upcoming")}
        className={`px-4 py-1 text-sm rounded transition-colors ${currentStatus === "upcoming" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
      >
        Upcoming
      </button>
      <button 
        onClick={() => setStatus("ended")}
        className={`px-4 py-1 text-sm rounded transition-colors ${currentStatus === "ended" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}
      >
        Ended
      </button>
    </div>
  );
}
