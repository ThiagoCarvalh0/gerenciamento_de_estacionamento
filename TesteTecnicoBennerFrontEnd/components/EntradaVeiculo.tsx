'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { veiculosService } from '@/lib/api';
import { formatarPlaca, validarPlaca } from '@/lib/pricing';
import { entradaVeiculoSchema, EntradaVeiculoFormData } from '@/lib/schemas';
import { handleApiError, showSuccessToast, showWarningToast } from '@/lib/errorHandler';

interface EntradaVeiculoProps {
  onSuccess?: () => void;
}

export function EntradaVeiculo({ onSuccess }: EntradaVeiculoProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<EntradaVeiculoFormData>({
    resolver: zodResolver(entradaVeiculoSchema),
  });

  const placaValue = watch('placa');

  const onSubmit = async (data: EntradaVeiculoFormData) => {
    setIsLoading(true);

    try {
      // Verifica se o veículo já está no estacionamento
      const veiculoExistente = await veiculosService.getByPlaca(data.placa);
      
      if (veiculoExistente && !veiculoExistente.saida) {
        showWarningToast('Veículo Já no Estacionamento', 'Este veículo já está registrado no estacionamento.');
        return;
      }

      await veiculosService.registrarEntrada({ placa: data.placa });
      
      const message = `Entrada registrada com sucesso para a placa ${formatarPlaca(data.placa)}!`;
      showSuccessToast('Entrada Registrada!', message);
      reset();
      onSuccess?.();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="placa" className="text-sm font-medium">
              Placa do Veículo
            </Label>
            <Input
              id="placa"
              placeholder="Ex: ABC1234"
              maxLength={7}
              {...register('placa')}
              className={`h-12 text-base transition-colors ${errors.placa ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500'}`}
              autoComplete="off"
            />
            {errors.placa && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                {errors.placa.message}
              </p>
            )}
            {placaValue && validarPlaca(placaValue) && (
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                Placa formatada: {formatarPlaca(placaValue)}
              </p>
            )}
          </div>


          <Button 
            type="submit" 
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm border-0 transition-colors" 
            disabled={isLoading}
          >
            {isLoading ? (
              'Registrando...'
            ) : (
              'Registrar Entrada'
            )}
          </Button>
        </form>
    </div>
  );
}
