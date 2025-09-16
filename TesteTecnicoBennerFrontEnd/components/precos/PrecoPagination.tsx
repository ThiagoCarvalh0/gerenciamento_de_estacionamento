'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { PrecoPaginated } from '@/lib/types';

interface PrecoPaginationProps {
  precosPaginated: PrecoPaginated;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PrecoPagination({ 
  precosPaginated, 
  currentPage, 
  onPageChange 
}: PrecoPaginationProps) {
  if (precosPaginated.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <div className="text-sm text-gray-600">
        Mostrando {((precosPaginated.page - 1) * precosPaginated.limit) + 1} a{' '}
        {Math.min(precosPaginated.page * precosPaginated.limit, precosPaginated.total)} de{' '}
        {precosPaginated.total} preços
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, precosPaginated.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? 'default' : 'outline'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === precosPaginated.totalPages}
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
