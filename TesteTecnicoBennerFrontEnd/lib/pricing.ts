import { Preco, CalculoEstacionamento } from './types';

/**
 * Calcula o valor a ser cobrado pelo estacionamento baseado nas regras:
 * - Até 30 minutos: metade do valor da hora inicial
 * - Hora adicional com tolerância de 10 minutos
 * - Exemplo: 1h10min = 1h, 1h15min = 2h
 */
export function calcularValorEstacionamento(
  dataEntrada: Date,
  dataSaida: Date,
  preco: Preco
): CalculoEstacionamento {
  const tempoTotalMs = dataSaida.getTime() - dataEntrada.getTime();
  const tempoTotalMinutos = Math.ceil(tempoTotalMs / (1000 * 60)); // Arredonda para cima

  // Se tempo <= 30 minutos, cobra metade da hora inicial
  if (tempoTotalMinutos <= 30) {
    return {
      tempoTotalMinutos,
      valorHoraInicial: preco.valorHoraInicial,
      valorHoraAdicional: preco.valorHoraAdicional,
      valorCobrado: preco.valorHoraInicial / 2,
      horasCompletas: 0,
      minutosExtras: tempoTotalMinutos,
      aplicouTolerancia: false,
    };
  }

  // Calcula horas completas considerando tolerância de 10 minutos
  const minutosSemTolerancia = tempoTotalMinutos - 10; // Remove 10 minutos de tolerância
  const horasCompletas = Math.max(0, Math.floor(minutosSemTolerancia / 60));
  const minutosExtras = Math.max(0, minutosSemTolerancia % 60);

  // Se ainda tem minutos extras após a tolerância, conta como hora adicional
  const horasAdicionais = horasCompletas + (minutosExtras > 0 ? 1 : 0);

  // Valor = hora inicial + (horas adicionais * valor hora adicional)
  const valorCobrado = preco.valorHoraInicial + (horasAdicionais * preco.valorHoraAdicional);

  return {
    tempoTotalMinutos,
    valorHoraInicial: preco.valorHoraInicial,
    valorHoraAdicional: preco.valorHoraAdicional,
    valorCobrado,
    horasCompletas: horasAdicionais,
    minutosExtras,
    aplicouTolerancia: minutosExtras > 0,
  };
}

/**
 * Formata o tempo de permanência em formato legível
 */
export function formatarTempoPermanencia(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;

  if (horas === 0) {
    return `${mins} min`;
  }

  if (mins === 0) {
    return `${horas}h`;
  }

  return `${horas}h ${mins}min`;
}

/**
 * Valida se uma placa está no formato correto (Brasileiro)
 * Aceita apenas placas sem traço: ABC1234 ou ABC1D23
 */
export function validarPlaca(placa: string): boolean {
  // Remove espaços, traços e converte para maiúsculo
  const placaLimpa = placa.replace(/[\s-]/g, '').toUpperCase();
  
  // Formato antigo: ABC1234 (3 letras + 4 números)
  const formatoAntigo = /^[A-Z]{3}[0-9]{4}$/;
  
  // Formato Mercosul: ABC1D23 (3 letras + 1 número + 1 letra + 2 números)
  const formatoMercosul = /^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/;
  
  return formatoAntigo.test(placaLimpa) || formatoMercosul.test(placaLimpa);
}

/**
 * Formata a placa para exibição
 * Remove traços e espaços, mantém apenas letras e números
 */
export function formatarPlaca(placa: string): string {
  // Remove espaços, traços e converte para maiúsculo
  const placaLimpa = placa.replace(/[\s-]/g, '').toUpperCase();
  
  if (placaLimpa.length === 7) {
    // Formato antigo: ABC1234
    if (/^[A-Z]{3}[0-9]{4}$/.test(placaLimpa)) {
      return placaLimpa; // Mantém sem traço
    }
    // Formato Mercosul: ABC1D23
    if (/^[A-Z]{3}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(placaLimpa)) {
      return placaLimpa; // Mantém sem traço
    }
  }
  
  return placaLimpa;
}

/**
 * Exemplos de cálculo para demonstração
 */
export const exemplosCalculo = [
  {
    tempo: '30 min',
    valor: 'R$ 1,00',
    descricao: 'Até 30 minutos: metade da hora inicial'
  },
  {
    tempo: '1h',
    valor: 'R$ 2,00',
    descricao: '1 hora: valor da hora inicial'
  },
  {
    tempo: '1h10min',
    valor: 'R$ 2,00',
    descricao: '1h10min: tolerância de 10min (cobra como 1h)'
  },
  {
    tempo: '1h15min',
    valor: 'R$ 3,00',
    descricao: '1h15min: 5min extras = 2h total'
  },
  {
    tempo: '2h5min',
    valor: 'R$ 3,00',
    descricao: '2h5min: tolerância de 10min (cobra como 2h)'
  },
  {
    tempo: '2h15min',
    valor: 'R$ 4,00',
    descricao: '2h15min: 5min extras = 3h total'
  }
];
