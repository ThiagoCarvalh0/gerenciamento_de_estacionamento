import { z } from 'zod';
import { validarPlaca } from './pricing';

// Schema para entrada de veículo
export const entradaVeiculoSchema = z.object({
  placa: z.string()
    .min(1, 'Placa é obrigatória')
    .refine(validarPlaca, 'Formato inválido. Use: ABC1234'),
});

// Schema para saída de veículo
export const saidaVeiculoSchema = z.object({
  placa: z.string()
    .min(1, 'Placa é obrigatória')
    .refine(validarPlaca, 'Formato inválido. Use: ABC1234'),
});

// Schema para preços
export const precoSchema = z.object({
  vigenciaInicio: z.string().min(1, 'Data de início é obrigatória'),
  vigenciaFim: z.string().min(1, 'Data de fim é obrigatória'),
  valorHoraInicial: z.number().min(0.01, 'Valor deve ser maior que zero'),
  valorHoraAdicional: z.number().min(0.01, 'Valor deve ser maior que zero'),
}).refine((data) => {
  const inicio = new Date(data.vigenciaInicio);
  const fim = new Date(data.vigenciaFim);
  return fim > inicio;
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['vigenciaFim'],
});

// Tipos inferidos dos schemas
export type EntradaVeiculoFormData = z.infer<typeof entradaVeiculoSchema>;
export type SaidaVeiculoFormData = z.infer<typeof saidaVeiculoSchema>;
export type PrecoFormData = z.infer<typeof precoSchema>;
