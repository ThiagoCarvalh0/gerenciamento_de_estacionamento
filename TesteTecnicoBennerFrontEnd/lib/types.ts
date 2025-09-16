// Tipos baseados na API OpenAPI fornecida

export interface Preco {
  id: number;
  vigenciaInicio: string; // ISO date-time
  vigenciaFim: string; // ISO date-time
  valorHoraInicial: number;
  valorHoraAdicional: number;
  ativo?: boolean; // Para soft delete
  dataCriacao?: string; // ISO date-time
  dataAtualizacao?: string; // ISO date-time
}

export interface PrecoPaginated {
  data: Preco[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EntradaVeiculoDto {
  placa: string;
}

export interface SaidaVeiculoDto {
  placa: string;
  valorCobrado: number;
}

export interface Veiculo {
  id: number;
  placa: string;
  entrada: string; // ISO date-time
  saida?: string; // ISO date-time (opcional)
  valorCobrado?: number;
}

export interface ValorAtualResponse {
  placa: string;
  valorAtual: number;
  mensagem: string;
}

// Tipos para formulários
export interface FormEntradaVeiculo {
  placa: string;
}

export interface FormSaidaVeiculo {
  placa: string;
}

export interface FormPreco {
  vigenciaInicio: string;
  vigenciaFim: string;
  valorHoraInicial: number;
  valorHoraAdicional: number;
}

// Tipos para cálculos
export interface CalculoEstacionamento {
  tempoTotalMinutos: number;
  valorHoraInicial: number;
  valorHoraAdicional: number;
  valorCobrado: number;
  horasCompletas: number;
  minutosExtras: number;
  aplicouTolerancia: boolean;
}
