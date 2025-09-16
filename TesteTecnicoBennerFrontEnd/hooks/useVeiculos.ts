import { useState, useEffect } from 'react';
import { veiculosService } from '@/lib/api';
import { Veiculo } from '@/lib/types';
import { handleApiError, showSuccessToast, showWarningToast } from '@/lib/errorHandler';

export function useVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarVeiculos = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const veiculosData = await veiculosService.getAll();
      setVeiculos(veiculosData);
    } catch (err) {
      setError('Erro ao carregar veículos');
      console.error('Erro ao carregar veículos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const registrarEntrada = async (placa: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Verifica se o veículo já está no estacionamento
      const veiculoExistente = await veiculosService.getByPlaca(placa);
      
      if (veiculoExistente && !veiculoExistente.saida) {
        showWarningToast('Veículo Já no Estacionamento', 'Este veículo já está registrado no estacionamento.');
        return false;
      }

      await veiculosService.registrarEntrada({ placa });
      showSuccessToast('Entrada Registrada!', 'Entrada registrada com sucesso!');
      carregarVeiculos();
      return true;
    } catch (err) {
      handleApiError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registrarSaida = async (placa: string, valorCobrado: number) => {
    setIsLoading(true);
    setError(null);

    try {
      await veiculosService.registrarSaida({ placa, valorCobrado });
      showSuccessToast('Saída Registrada!', 'Saída registrada com sucesso!');
      carregarVeiculos();
      return true;
    } catch (err) {
      handleApiError(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVeiculos();
  }, []);

  return {
    veiculos,
    isLoading,
    error,
    carregarVeiculos,
    registrarEntrada,
    registrarSaida,
  };
}
