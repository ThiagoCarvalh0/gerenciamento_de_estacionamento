'use client';

import { Button } from '../ui/button';
import { ViewMode, OrderBy, Order } from '@/hooks/usePrecos';

interface PrecoFiltersProps {
  viewMode: ViewMode;
  orderBy: OrderBy;
  order: Order;
  onViewModeChange: (mode: ViewMode) => void;
  onOrderChange: (orderBy: OrderBy) => void;
}

export function PrecoFilters({
  viewMode,
  orderBy,
  order,
  onViewModeChange,
  onOrderChange,
}: PrecoFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrar:</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('all')}
            className="h-8 px-3 text-xs"
          >
            Todas as Tabelas
          </Button>
          <Button
            variant={viewMode === 'vigentes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('vigentes')}
            className="h-8 px-3 text-xs"
          >
            Em Vigência
          </Button>
          <Button
            variant={viewMode === 'recentes' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewModeChange('recentes')}
            className="h-8 px-3 text-xs"
          >
            Recentes
          </Button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">Ordenar:</span>
        <div className="flex gap-1">
          <Button
            variant={orderBy === 'id' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onOrderChange('id')}
            className="h-8 px-3 text-xs"
          >
            ID {orderBy === 'id' && (order === 'desc' ? '↓' : '↑')}
          </Button>
          <Button
            variant={orderBy === 'vigenciaInicio' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onOrderChange('vigenciaInicio')}
            className="h-8 px-3 text-xs"
          >
            Início {orderBy === 'vigenciaInicio' && (order === 'desc' ? '↓' : '↑')}
          </Button>
          <Button
            variant={orderBy === 'vigenciaFim' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onOrderChange('vigenciaFim')}
            className="h-8 px-3 text-xs"
          >
            Fim {orderBy === 'vigenciaFim' && (order === 'desc' ? '↓' : '↑')}
          </Button>
        </div>
      </div>
    </div>
  );
}
