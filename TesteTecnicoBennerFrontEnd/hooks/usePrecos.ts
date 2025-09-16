import { useState, useEffect } from 'react';
import { precosService, toLocalISOString } from '@/lib/api';
import { Preco, PrecoPaginated } from '@/lib/types';
import { PrecoFormData } from '@/lib/schemas';
import { handleApiError, showSuccessToast } from '@/lib/errorHandler';

export type ViewMode = 'all' | 'vigentes' | 'recentes';
export type OrderBy = 'id' | 'vigenciaInicio' | 'vigenciaFim';
export type Order = 'asc' | 'desc';

export function usePrecos() {
  const [precos, setPrecos] = useState<Preco[]>([]);
  const [precosPaginated, setPrecosPaginated] = useState<PrecoPaginated | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<OrderBy>('id');
  const [order, setOrder] = useState<Order>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  const carregarPrecos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let precosData: Preco[];
      
      switch (viewMode) {
        case 'vigentes':
          precosData = await precosService.getVigentes();
          setPrecos(Array.isArray(precosData) ? precosData : []);
          setPrecosPaginated(null);
          break;
        case 'recentes':
          precosData = await precosService.getRecentes();
          setPrecos(Array.isArray(precosData) ? precosData : []);
          setPrecosPaginated(null);
          break;
        default:
          if (precos.length > 50) {
            // Se há muitos preços, usa paginação
            const paginatedData = await precosService.getPaginated(currentPage, itemsPerPage, orderBy, order);
            setPrecosPaginated(paginatedData);
            setPrecos(paginatedData.data);
          } else {
            // Se há poucos preços, carrega todos
            precosData = await precosService.getAll();
            if (Array.isArray(precosData)) {
              setPrecos(precosData.sort((a, b) => {
                const aValue = a[orderBy];
                const bValue = b[orderBy];
                if (order === 'asc') {
                  return aValue > bValue ? 1 : -1;
                } else {
                  return aValue < bValue ? 1 : -1;
                }
              }));
            } else {
              setPrecos([]);
            }
            setPrecosPaginated(null);
          }
          break;
      }
    } catch (err) {
      setError('Erro ao carregar preços');
      console.error('Erro ao carregar preços:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const criarPreco = async (data: PrecoFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const precoData = {
        vigenciaInicio: toLocalISOString(data.vigenciaInicio),
        vigenciaFim: toLocalISOString(data.vigenciaFim),
        valorHoraInicial: data.valorHoraInicial,
        valorHoraAdicional: data.valorHoraAdicional,
      };

      await precosService.create(precoData);
      showSuccessToast('Preço Cadastrado!', 'Tabela de preços cadastrada com sucesso!');
      carregarPrecos();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const atualizarPreco = async (id: number, data: PrecoFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const precoData = {
        vigenciaInicio: toLocalISOString(data.vigenciaInicio),
        vigenciaFim: toLocalISOString(data.vigenciaFim),
        valorHoraInicial: data.valorHoraInicial,
        valorHoraAdicional: data.valorHoraAdicional,
      };

      await precosService.update(id, precoData);
      showSuccessToast('Preço Atualizado!', 'Tabela de preços atualizada com sucesso!');
      carregarPrecos();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const excluirPreco = async (id: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await precosService.delete(id);
      showSuccessToast('Preço Excluído!', 'Tabela de preços excluída com sucesso!');
      carregarPrecos();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleOrderChange = (newOrderBy: OrderBy) => {
    if (orderBy === newOrderBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(newOrderBy);
      setOrder('desc');
    }
    setCurrentPage(1);
  };

  useEffect(() => {
    carregarPrecos();
  }, [currentPage, itemsPerPage, orderBy, order, viewMode]);

  return {
    precos,
    precosPaginated,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    orderBy,
    order,
    viewMode,
    setViewMode,
    carregarPrecos,
    criarPreco,
    atualizarPreco,
    excluirPreco,
    handlePageChange,
    handleOrderChange,
  };
}
