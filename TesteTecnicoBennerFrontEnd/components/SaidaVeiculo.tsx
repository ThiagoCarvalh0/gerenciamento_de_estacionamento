'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { veiculosService, formatCurrency, formatDateTime } from '@/lib/api';
import { formatarPlaca, formatarTempoPermanencia, validarPlaca } from '@/lib/pricing';
import { Veiculo } from '@/lib/types';
import { saidaVeiculoSchema, SaidaVeiculoFormData } from '@/lib/schemas';
import { handleApiError, showSuccessToast, showWarningToast } from '@/lib/errorHandler';

interface SaidaVeiculoProps {
  onSuccess?: () => void;
}

export function SaidaVeiculo({ onSuccess }: SaidaVeiculoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [veiculo, setVeiculo] = useState<Veiculo | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SaidaVeiculoFormData>({
    resolver: zodResolver(saidaVeiculoSchema),
  });

  const placaValue = watch('placa');

  const buscarVeiculo = async (placa: string) => {
    setVeiculo(null);

    try {
      const veiculoEncontrado = await veiculosService.getByPlaca(placa);
      
      if (!veiculoEncontrado) {
        showWarningToast('Veículo Não Encontrado', 'Não foi possível encontrar um veículo com esta placa.');
        return;
      }

      if (veiculoEncontrado.saida) {
        showWarningToast('Veículo Já Saiu', 'Este veículo já saiu do estacionamento.');
        return;
      }

      // Busca o valor atual do veículo usando o endpoint específico
      try {
        const valorAtual = await veiculosService.getValorAtual(placa);
        veiculoEncontrado.valorCobrado = valorAtual;
      } catch (valorError) {
        console.warn('Erro ao buscar valor atual, usando valor do veículo:', valorError);
        // Se falhar, mantém o valor que já vem do veículo
      }

      setVeiculo(veiculoEncontrado);
      showSuccessToast('Veículo Encontrado!', 'Dados do veículo carregados com sucesso.');
    } catch (err) {
      handleApiError(err);
    }
  };


  const onSubmit = async (data: SaidaVeiculoFormData) => {
    if (!veiculo) {
      showWarningToast('Veículo Não Selecionado', 'Busque o veículo antes de registrar a saída!');
      return;
    }

    setIsLoading(true);

    try {
      // Usa o valor atual do veículo ou 0 como fallback
      const valorCobrado = veiculo.valorCobrado || 0;
      
      await veiculosService.registrarSaida({
        placa: data.placa,
        valorCobrado: valorCobrado,
      });
      
      const message = `Saída registrada com sucesso!`;
      showSuccessToast('Saída Registrada!', message);
      reset();
      setVeiculo(null);
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
            <div className="flex gap-2">
              <Input
                id="placa"
                placeholder="Ex: ABC1234"
                maxLength={7}
                {...register('placa')}
                className={`h-12 text-base flex-1 transition-colors ${errors.placa ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500'}`}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => placaValue && buscarVeiculo(placaValue)}
                disabled={!placaValue || !validarPlaca(placaValue)}
                className="h-12 px-4 whitespace-nowrap"
              >
                Buscar
              </Button>
            </div>
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

          {veiculo && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg space-y-3 animate-in slide-in-from-top-2 duration-300">
              <h4 className="font-medium text-orange-900 flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                Veículo Encontrado
              </h4>
              <div className="space-y-2 text-sm">
                <p className="text-orange-700">
                  <strong>Placa:</strong> {formatarPlaca(veiculo.placa)}
                </p>
                <p className="text-orange-700">
                  <strong>Entrada:</strong> {formatDateTime(veiculo.entrada)}
                </p>
                {veiculo.saida && (
                  <p className="text-orange-700">
                    <strong>Saída:</strong> {formatDateTime(veiculo.saida)}
                  </p>
                )}
                {veiculo.valorCobrado !== undefined && veiculo.valorCobrado !== null && (
                  <p className="text-orange-700">
                    <strong>Valor Cobrado:</strong> {formatCurrency(veiculo.valorCobrado)}
                  </p>
                )}
              </div>
            </div>
          )}


          <Button 
            type="submit" 
            className="w-full h-11 bg-orange-600 hover:bg-orange-700 text-white font-medium text-sm border-0 transition-colors" 
            disabled={isLoading || !veiculo}
          >
            {isLoading ? (
              'Registrando...'
            ) : (
              'Registrar Saída'
            )}
          </Button>
        </form>
    </div>
  );
}
