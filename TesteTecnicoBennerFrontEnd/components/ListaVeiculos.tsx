'use client';

import { useState, useEffect } from 'react';
import { Car, Clock, DollarSign, RefreshCw } from 'lucide-react';

import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { veiculosService, formatCurrency, formatDateTime } from '@/lib/api';
import { formatarPlaca, formatarTempoPermanencia } from '@/lib/pricing';
import { Veiculo } from '@/lib/types';

export function ListaVeiculos() {
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

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const veiculosNoEstacionamento = veiculos.filter(v => !v.saida).sort((a, b) => 
    new Date(b.entrada).getTime() - new Date(a.entrada).getTime()
  );
  const veiculosSaidos = veiculos.filter(v => v.saida).sort((a, b) => 
    new Date(b.saida!).getTime() - new Date(a.saida!).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Car className="h-5 w-5 text-orange-600" />
                </div>
                Controle de Veículos
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Visualize todos os veículos que entraram e saíram do estacionamento
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={carregarVeiculos}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6 animate-in slide-in-from-top-2 duration-300">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Veículos no Estacionamento */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Car className="h-5 w-5 text-green-600" />
                No Estacionamento ({veiculosNoEstacionamento.length})
              </h3>
              {veiculosNoEstacionamento.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Car className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Nenhum veículo no estacionamento</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {veiculosNoEstacionamento.map((veiculo) => (
                    <div
                      key={`${veiculo.placa}-${veiculo.entrada}`}
                      className="p-4 bg-green-50 border border-green-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-green-900 text-lg">
                            {formatarPlaca(veiculo.placa)}
                          </p>
                          <p className="text-sm text-green-700">
                            Entrada: {formatDateTime(veiculo.entrada)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                            Ativo
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Veículos que Saíram */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <Clock className="h-5 w-5 text-gray-600" />
                Saíram ({veiculosSaidos.length})
              </h3>
              {veiculosSaidos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Nenhum veículo saiu ainda</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {veiculosSaidos.map((veiculo) => (
                    <div
                      key={`${veiculo.placa}-${veiculo.entrada}`}
                      className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-lg">
                            {formatarPlaca(veiculo.placa)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Entrada: {formatDateTime(veiculo.entrada)}
                          </p>
                          {veiculo.saida && (
                            <p className="text-sm text-gray-600">
                              Saída: {formatDateTime(veiculo.saida)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {veiculo.valorCobrado && (
                            <p className="font-medium text-gray-900 text-lg">
                              {formatCurrency(veiculo.valorCobrado)}
                            </p>
                          )}
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                            Finalizado
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Resumo */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumo do Sistema
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center sm:text-left">
                <p className="text-blue-700 text-sm font-medium">Total de Veículos</p>
                <p className="font-bold text-blue-900 text-xl">{veiculos.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-green-700 text-sm font-medium">No Estacionamento</p>
                <p className="font-bold text-green-600 text-xl">{veiculosNoEstacionamento.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-gray-700 text-sm font-medium">Saíram</p>
                <p className="font-bold text-gray-600 text-xl">{veiculosSaidos.length}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-blue-700 text-sm font-medium">Faturamento Total</p>
                <p className="font-bold text-blue-900 text-xl">
                  {formatCurrency(
                    veiculosSaidos.reduce((total, v) => total + (v.valorCobrado || 0), 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
