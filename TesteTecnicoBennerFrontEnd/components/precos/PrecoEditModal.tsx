'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { precoSchema, PrecoFormData } from '@/lib/schemas';
import { Preco } from '@/lib/types';

interface PrecoEditModalProps {
  preco: Preco;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (data: PrecoFormData) => void;
}

export function PrecoEditModal({ 
  preco, 
  isOpen, 
  isLoading, 
  onClose, 
  onSubmit 
}: PrecoEditModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PrecoFormData>({
    resolver: zodResolver(precoSchema),
  });

  // Preenche o formulário quando o modal abre
  React.useEffect(() => {
    if (isOpen && preco) {
      setValue('vigenciaInicio', preco.vigenciaInicio.slice(0, 16));
      setValue('vigenciaFim', preco.vigenciaFim.slice(0, 16));
      setValue('valorHoraInicial', preco.valorHoraInicial);
      setValue('valorHoraAdicional', preco.valorHoraAdicional);
    }
  }, [isOpen, preco, setValue]);

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Editar Tabela de Preços
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Atualize as informações da tabela de preços
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-vigenciaInicio" className="text-sm font-medium text-slate-700">
                Data de Início
              </Label>
              <Input
                id="edit-vigenciaInicio"
                type="datetime-local"
                {...register('vigenciaInicio')}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vigenciaInicio && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.vigenciaInicio.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-vigenciaFim" className="text-sm font-medium text-slate-700">
                Data de Fim
              </Label>
              <Input
                id="edit-vigenciaFim"
                type="datetime-local"
                {...register('vigenciaFim')}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vigenciaFim && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.vigenciaFim.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-valorHoraInicial" className="text-sm font-medium text-slate-700">
                Valor Hora Inicial (R$)
              </Label>
              <Input
                id="edit-valorHoraInicial"
                type="number"
                step="0.01"
                min="0.01"
                max="999.99"
                {...register('valorHoraInicial', { valueAsNumber: true })}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.valorHoraInicial && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.valorHoraInicial.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-valorHoraAdicional" className="text-sm font-medium text-slate-700">
                Valor Hora Adicional (R$)
              </Label>
              <Input
                id="edit-valorHoraAdicional"
                type="number"
                step="0.01"
                min="0.01"
                max="999.99"
                {...register('valorHoraAdicional', { valueAsNumber: true })}
                className="h-11 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.valorHoraAdicional && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.valorHoraAdicional.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white border-0"
            >
              {isLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
