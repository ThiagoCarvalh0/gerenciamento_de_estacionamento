'use client';

import { useState } from 'react';
import { DollarSign } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { usePrecos } from '@/hooks/usePrecos';
import { PrecoFormData } from '@/lib/schemas';
import { Preco } from '@/lib/types';
import { PrecoForm } from './precos/PrecoForm';
import { PrecoFilters } from './precos/PrecoFilters';
import { PrecoCard } from './precos/PrecoCard';
import { PrecoPagination } from './precos/PrecoPagination';
import { PrecoEditModal } from './precos/PrecoEditModal';
import { PrecoDeleteModal } from './precos/PrecoDeleteModal';

export function GestaoPrecos() {
  const {
    precos,
    precosPaginated,
    isLoading,
    error,
    currentPage,
    orderBy,
    order,
    viewMode,
    setViewMode,
    criarPreco,
    atualizarPreco,
    excluirPreco,
    handlePageChange,
    handleOrderChange,
  } = usePrecos();

  const [editingPreco, setEditingPreco] = useState<Preco | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const handleEditPreco = (preco: Preco) => {
    setEditingPreco(preco);
    setIsEditModalOpen(true);
  };

  const handleUpdatePreco = async (data: PrecoFormData) => {
    if (!editingPreco) return;
    
    await atualizarPreco(editingPreco.id, data);
    setIsEditModalOpen(false);
    setEditingPreco(null);
  };

  const handleDeletePreco = async (id: number) => {
    await excluirPreco(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Formulário de Cadastro */}
      <Card className="shadow-lg">
        <CardHeader className="pb-6 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Cadastro de Tabela de Preços
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">
            Configure os valores praticados pelo estacionamento com controle de vigência
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PrecoForm 
            onSubmit={criarPreco}
            isLoading={isLoading}
            submitText="Cadastrar Tabela de Preços"
          />
        </CardContent>
      </Card>

      {/* Lista de Preços */}
      <Card className="shadow-lg">
        <CardHeader className="pb-6 border-b border-gray-200">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Tabelas de Preços Cadastradas
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">
            Gerencie todas as tabelas de preços e suas vigências
          </CardDescription>
        </CardHeader>
        <CardContent>
          {precos.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">Nenhum preço cadastrado ainda</p>
              <p className="text-gray-400 text-sm mt-2">Cadastre o primeiro preço usando o formulário acima</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filtros e Ordenação */}
              <PrecoFilters
                viewMode={viewMode}
                orderBy={orderBy}
                order={order}
                onViewModeChange={setViewMode}
                onOrderChange={handleOrderChange}
              />

              {/* Lista de Preços */}
              {precos.map((preco) => (
                <PrecoCard
                  key={preco.id}
                  preco={preco}
                  onEdit={handleEditPreco}
                  onDelete={setShowDeleteConfirm}
                />
              ))}
              
              {/* Paginação */}
              {precosPaginated && (
                <PrecoPagination
                  precosPaginated={precosPaginated}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {editingPreco && (
        <PrecoEditModal
          preco={editingPreco}
          isOpen={isEditModalOpen}
          isLoading={isLoading}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingPreco(null);
          }}
          onSubmit={handleUpdatePreco}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <PrecoDeleteModal
        isOpen={showDeleteConfirm !== null}
        isLoading={isLoading}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeletePreco(showDeleteConfirm)}
      />
    </div>
  );
}