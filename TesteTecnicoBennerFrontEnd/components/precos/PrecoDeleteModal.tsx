'use client';

import { Button } from '../ui/button';

interface PrecoDeleteModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function PrecoDeleteModal({ 
  isOpen, 
  isLoading, 
  onClose, 
  onConfirm 
}: PrecoDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-slate-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Confirmar Exclusão
          </h3>
          <p className="text-gray-600 text-sm">
            Esta ação não pode ser desfeita
          </p>
        </div>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <p className="text-slate-700 text-sm leading-relaxed">
            Tem certeza que deseja excluir este preço? Esta ação removerá permanentemente 
            o registro da tabela de preços e pode afetar cálculos futuros.
          </p>
        </div>
        
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 bg-red-600 hover:bg-red-700 text-white border-0"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </div>
      </div>
    </div>
  );
}
