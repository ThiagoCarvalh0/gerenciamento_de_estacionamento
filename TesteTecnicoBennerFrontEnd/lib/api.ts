import axios from 'axios';
import { Preco, EntradaVeiculoDto, SaidaVeiculoDto, Veiculo, ValorAtualResponse } from './types';

// Configuração base da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para resposta padrão da API
interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
  timestamp: string;
}

// Serviços para Preços
export const precosService = {
  // Buscar todos os preços
  async getAll(): Promise<Preco[]> {
    const response = await api.get<ApiResponse<Preco[]>>('/api/Precos');
    return response.data.dados;
  },

  // Buscar preços com paginação
  async getPaginated(page: number = 1, limit: number = 10, orderBy: 'id' | 'vigenciaInicio' | 'vigenciaFim' = 'id', order: 'asc' | 'desc' = 'desc'): Promise<{
    data: Preco[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const response = await api.get<ApiResponse<{
      data: Preco[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>(`/api/Precos/paginated?page=${page}&limit=${limit}&orderBy=${orderBy}&order=${order}`);
    return response.data.dados;
  },

  // Buscar apenas preços vigentes (mais performático)
  async getVigentes(): Promise<Preco[]> {
    const response = await api.get<ApiResponse<Preco[]>>('/api/Precos/vigentes');
    return response.data.dados;
  },

  // Buscar preços recentes (últimos 30 dias)
  async getRecentes(): Promise<Preco[]> {
    const response = await api.get<ApiResponse<Preco[]>>('/api/Precos/recentes');
    return response.data.dados;
  },

  // Criar novo preço
  async create(preco: Omit<Preco, 'id'>): Promise<Preco> {
    const response = await api.post<ApiResponse<Preco>>('/api/Precos', preco);
    return response.data.dados;
  },

  // Atualizar preço existente
  async update(id: number, preco: Partial<Omit<Preco, 'id'>>): Promise<Preco> {
    const response = await api.put<ApiResponse<Preco>>(`/api/Precos/${id}`, preco);
    return response.data.dados;
  },

  // Excluir preço (soft delete)
  async delete(id: number): Promise<void> {
    await api.delete(`/api/Precos/${id}`);
  },

  // Buscar preço vigente para uma data específica
  async getVigenteParaData(data: Date): Promise<Preco | null> {
    const precos = await this.getAll();
    const dataISO = data.toISOString();
    
    const precoVigente = precos.find(preco => 
      dataISO >= preco.vigenciaInicio && dataISO <= preco.vigenciaFim
    );
    
    return precoVigente || null;
  }
};

// Serviços para Veículos
export const veiculosService = {
  // Registrar entrada de veículo
  async registrarEntrada(dto: EntradaVeiculoDto): Promise<void> {
    await api.post('/api/Veiculos/entrada', dto);
  },

  // Registrar saída de veículo
  async registrarSaida(dto: SaidaVeiculoDto): Promise<void> {
    await api.post('/api/Veiculos/saida', dto);
  },

  // Buscar todos os veículos
  async getAll(): Promise<Veiculo[]> {
    const response = await api.get<ApiResponse<Veiculo[]>>('/api/Veiculos');
    return response.data.dados;
  },

  // Buscar veículo por placa
  async getByPlaca(placa: string): Promise<Veiculo | null> {
    try {
      const response = await api.get<ApiResponse<Veiculo>>(`/api/Veiculos/${placa}`);
      return response.data.dados;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Buscar valor atual do veículo
  async getValorAtual(placa: string): Promise<number> {
    try {
      const response = await api.get<ApiResponse<ValorAtualResponse>>(`/api/Veiculos/${placa}/valor-atual`);
      
      // Verifica se o valor é um número válido
      const valor = response.data.dados.valorAtual;
      if (typeof valor !== 'number' || isNaN(valor)) {
        return 0;
      }
      
      return valor;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return 0;
      }
      throw error;
    }
  }
};

// Utilitários para formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

// Funções para conversão correta de datas considerando fuso horário local
export const toLocalISOString = (dateString: string): string => {
  // Cria uma data a partir da string datetime-local (que já está no fuso local)
  const date = new Date(dateString);
  
  // Calcula o offset do fuso horário local em minutos
  const timezoneOffset = date.getTimezoneOffset();
  
  // Ajusta a data subtraindo o offset para manter o horário local
  const adjustedDate = new Date(date.getTime() - (timezoneOffset * 60000));
  
  return adjustedDate.toISOString();
};

export const fromISOStringToLocal = (isoString: string): string => {
  const date = new Date(isoString);
  
  // Calcula o offset do fuso horário local em minutos
  const timezoneOffset = date.getTimezoneOffset();
  
  // Ajusta a data adicionando o offset para converter de UTC para local
  const adjustedDate = new Date(date.getTime() + (timezoneOffset * 60000));
  
  // Formata para datetime-local (YYYY-MM-DDTHH:mm)
  const year = adjustedDate.getFullYear();
  const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
  const day = String(adjustedDate.getDate()).padStart(2, '0');
  const hours = String(adjustedDate.getHours()).padStart(2, '0');
  const minutes = String(adjustedDate.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Funções para gerenciamento de vigência de preços
export const isPrecoVigente = (preco: { vigenciaInicio: string; vigenciaFim: string }, dataReferencia?: Date): boolean => {
  const data = dataReferencia || new Date();
  const inicio = new Date(preco.vigenciaInicio);
  const fim = new Date(preco.vigenciaFim);
  return data >= inicio && data <= fim;
};

export const getPrecoVigente = (precos: Array<{ id: number; vigenciaInicio: string; vigenciaFim: string; [key: string]: any }>, dataReferencia?: Date): any | null => {
  const data = dataReferencia || new Date();
  
  // Filtra preços vigentes
  const precosVigentes = precos.filter(preco => isPrecoVigente(preco, data));
  
  if (precosVigentes.length === 0) {
    return null;
  }
  
  if (precosVigentes.length === 1) {
    return precosVigentes[0];
  }
  
  // Se há múltiplos preços vigentes, aplica regras de prioridade:
  // 1. Preço com período mais específico (menor duração) tem prioridade
  // 2. Em caso de empate, o preço com ID maior (mais recente) tem prioridade
  
  return precosVigentes.reduce((precoAtual, precoComparacao) => {
    const duracaoAtual = new Date(precoAtual.vigenciaFim).getTime() - new Date(precoAtual.vigenciaInicio).getTime();
    const duracaoComparacao = new Date(precoComparacao.vigenciaFim).getTime() - new Date(precoComparacao.vigenciaInicio).getTime();
    
    // Se o período de comparação é mais específico (menor duração), ele tem prioridade
    if (duracaoComparacao < duracaoAtual) {
      return precoComparacao;
    }
    
    // Se as durações são iguais, o ID maior (mais recente) tem prioridade
    if (duracaoComparacao === duracaoAtual && precoComparacao.id > precoAtual.id) {
      return precoComparacao;
    }
    
    return precoAtual;
  });
};

export const getConflitosVigencia = (precos: Array<{ id: number; vigenciaInicio: string; vigenciaFim: string; [key: string]: any }>, dataReferencia?: Date): Array<{ id: number; vigenciaInicio: string; vigenciaFim: string; [key: string]: any }> => {
  const data = dataReferencia || new Date();
  const precosVigentes = precos.filter(preco => isPrecoVigente(preco, data));
  
  // Se há mais de um preço vigente, todos exceto o prioritário são conflitos
  if (precosVigentes.length <= 1) {
    return [];
  }
  
  const precoPrioritario = getPrecoVigente(precos, data);
  return precosVigentes.filter(preco => preco.id !== precoPrioritario?.id);
};