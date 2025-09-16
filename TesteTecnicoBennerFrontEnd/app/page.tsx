'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { EntradaVeiculo } from '@/components/EntradaVeiculo';
import { SaidaVeiculo } from '@/components/SaidaVeiculo';
import { GestaoPrecos } from '@/components/GestaoPrecos';
import { ListaVeiculos } from '@/components/ListaVeiculos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Painel Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Entrada de Veículos */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Entrada de Veículos
                </CardTitle>
                <CardDescription>
                  Registre a entrada de veículos no estacionamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EntradaVeiculo onSuccess={handleSuccess} />
              </CardContent>
            </Card>

            {/* Saída de Veículos */}
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Saída de Veículos
                </CardTitle>
                <CardDescription>
                  Registre a saída e calcule o valor a ser cobrado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SaidaVeiculo onSuccess={handleSuccess} />
              </CardContent>
            </Card>
          </div>

          {/* Gestão de Preços */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Gestão de Tabelas de Preços
              </CardTitle>
              <CardDescription>
                Configure os valores praticados pelo estacionamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GestaoPrecos />
            </CardContent>
          </Card>

          {/* Lista de Veículos */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Controle de Veículos
              </CardTitle>
              <CardDescription>
                Visualize todos os veículos no estacionamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ListaVeiculos key={refreshKey} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
