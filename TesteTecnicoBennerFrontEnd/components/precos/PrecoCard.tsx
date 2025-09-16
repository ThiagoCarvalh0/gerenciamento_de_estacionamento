'use client';

import { DollarSign } from 'lucide-react';
import { Button } from '../ui/button';
import { formatCurrency, formatDateTime, isPrecoVigente } from '@/lib/api';
import { Preco } from '@/lib/types';

interface PrecoCardProps {
  preco: Preco;
  onEdit: (preco: Preco) => void;
  onDelete: (id: number) => void;
}

export function PrecoCard({ preco, onEdit, onDelete }: PrecoCardProps) {
  const isVigenteAtual = isPrecoVigente(preco);

  return (
    <div
      className={`p-5 border rounded-lg transition-all duration-200 hover:shadow-md ${
        isVigenteAtual
          ? 'bg-green-50 border-green-200 hover:bg-green-100'
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded ${
            isVigenteAtual
              ? 'bg-green-100'
              : 'bg-gray-100'
          }`}>
            <DollarSign className={`h-5 w-5 ${
              isVigenteAtual
                ? 'text-green-600'
                : 'text-gray-600'
            }`} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-lg">
                {formatCurrency(preco.valorHoraInicial)} / {formatCurrency(preco.valorHoraAdicional)}
              </span>
              {isVigenteAtual && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded border border-green-200">
                  VIGENTE
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Hora inicial / Hora adicional
            </p>
          </div>
        </div>
        
        {/* Botões de Ação */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(preco)}
            className="h-8 px-3 text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(preco.id)}
            className="h-8 px-3 text-xs border-red-300 text-red-600 hover:bg-red-50"
          >
            Excluir
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">
            <strong>Vigência:</strong>
          </p>
          <p className="text-gray-800">
            {formatDateTime(preco.vigenciaInicio)} até {formatDateTime(preco.vigenciaFim)}
          </p>
        </div>
        <div>
          <p className="text-gray-600">
            <strong>Valores:</strong>
          </p>
          <p className="text-gray-800">
            Inicial: {formatCurrency(preco.valorHoraInicial)} | Adicional: {formatCurrency(preco.valorHoraAdicional)}
          </p>
        </div>
      </div>
    </div>
  );
}
