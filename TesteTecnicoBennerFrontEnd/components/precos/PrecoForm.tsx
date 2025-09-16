'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { precoSchema, PrecoFormData } from '@/lib/schemas';

interface PrecoFormProps {
  onSubmit: (data: PrecoFormData) => void;
  isLoading: boolean;
  submitText?: string;
  defaultValues?: Partial<PrecoFormData>;
}

export function PrecoForm({ 
  onSubmit, 
  isLoading, 
  submitText = 'Cadastrar Tabela de Preços',
  defaultValues 
}: PrecoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PrecoFormData>({
    resolver: zodResolver(precoSchema),
    defaultValues,
  });

  const handleFormSubmit = (data: PrecoFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="vigenciaInicio" className="text-sm font-medium">
            Data de Início
          </Label>
          <Input
            id="vigenciaInicio"
            type="datetime-local"
            {...register('vigenciaInicio')}
            className={`h-11 text-sm border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${errors.vigenciaInicio ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.vigenciaInicio && (
            <p className="text-sm text-red-600 mt-1">
              {errors.vigenciaInicio.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="vigenciaFim" className="text-sm font-medium">
            Data de Fim
          </Label>
          <Input
            id="vigenciaFim"
            type="datetime-local"
            {...register('vigenciaFim')}
            className={`h-11 text-sm border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${errors.vigenciaFim ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.vigenciaFim && (
            <p className="text-sm text-red-600 mt-1">
              {errors.vigenciaFim.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorHoraInicial" className="text-sm font-medium">
            Valor Hora Inicial (R$)
          </Label>
          <Input
            id="valorHoraInicial"
            type="number"
            step="0.01"
            min="0.01"
            max="999.99"
            placeholder="0,00"
            {...register('valorHoraInicial', { valueAsNumber: true })}
            className={`h-11 text-sm border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${errors.valorHoraInicial ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.valorHoraInicial && (
            <p className="text-sm text-red-600 mt-1">
              {errors.valorHoraInicial.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorHoraAdicional" className="text-sm font-medium">
            Valor Hora Adicional (R$)
          </Label>
          <Input
            id="valorHoraAdicional"
            type="number"
            step="0.01"
            min="0.01"
            max="999.99"
            placeholder="0,00"
            {...register('valorHoraAdicional', { valueAsNumber: true })}
            className={`h-11 text-sm border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 ${errors.valorHoraAdicional ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
          />
          {errors.valorHoraAdicional && (
            <p className="text-sm text-red-600 mt-1">
              {errors.valorHoraAdicional.message}
            </p>
          )}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm border-0" 
        disabled={isLoading}
      >
        {isLoading ? 'Processando...' : submitText}
      </Button>
    </form>
  );
}
