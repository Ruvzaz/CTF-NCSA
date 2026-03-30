'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export function PaginationControl({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          ) : (
            <PaginationPrevious href="#" className="pointer-events-none opacity-50" />
          )}
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          }
          if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return null;
        })}

        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext href={createPageURL(currentPage + 1)} />
          ) : (
            <PaginationNext href="#" className="pointer-events-none opacity-50" />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
