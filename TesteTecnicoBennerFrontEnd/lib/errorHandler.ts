import { toast } from 'sonner';
import axios from 'axios';

// Interface para erros da API (novo padrão)
interface ApiError {
  caminho?: string;
  codigo: string;
  dados: any;
  detalhes: any;
  mensagem: string;
  sucesso: boolean;
  timestamp: string;
}

// Mapeamento de códigos de erro para mensagens amigáveis
const ERROR_MESSAGES: Record<string, { title: string; description: string; action?: string }> = {
  'PRECO_NAO_VIGENTE': {
    title: 'Tabela de Preços Não Configurada',
    description: 'Não há uma tabela de preços vigente no momento. É necessário configurar uma tabela de preços antes de permitir entradas de veículos.',
    action: 'Configure uma tabela de preços na seção "Gestão de Preços"'
  },
  'VALIDACAO_FALHOU': {
    title: 'Erro de Validação',
    description: 'Os dados fornecidos não são válidos ou estão incompletos.',
    action: 'Verifique os campos obrigatórios e tente novamente'
  },
  'VEICULO_JA_EXISTE': {
    title: 'Veículo Já no Estacionamento',
    description: 'Este veículo já está registrado no estacionamento.',
    action: 'Verifique se o veículo já não está estacionado'
  },
  'VEICULO_NAO_ENCONTRADO': {
    title: 'Veículo Não Encontrado',
    description: 'Não foi possível encontrar um veículo com esta placa.',
    action: 'Verifique se a placa está correta'
  },
  'VEICULO_JA_SAIU': {
    title: 'Veículo Já Saiu',
    description: 'Este veículo já saiu do estacionamento.',
    action: 'Verifique o histórico de movimentações'
  },
  'ERRO_SERVIDOR': {
    title: 'Erro no Servidor',
    description: 'Ocorreu um erro interno no servidor.',
    action: 'Tente novamente em alguns instantes'
  },
  'SERVICO_INDISPONIVEL': {
    title: 'Serviço Indisponível',
    description: 'O serviço está temporariamente indisponível.',
    action: 'Tente novamente em alguns minutos'
  },
  'ERRO_BANCO_DADOS': {
    title: 'Erro de Banco de Dados',
    description: 'Não foi possível acessar os dados.',
    action: 'Tente novamente ou entre em contato com o suporte'
  }
};

// Função para tratar erros da API
export function handleApiError(error: unknown): void {
  console.error('Erro da API:', error);

  // Se for um erro do Axios
  if (axios.isAxiosError(error)) {
    const response = error.response;
    
    if (response?.data) {
      const apiError = response.data as ApiError;
      
      // Se tiver código de erro conhecido
      if (apiError.codigo && ERROR_MESSAGES[apiError.codigo]) {
        const errorInfo = ERROR_MESSAGES[apiError.codigo];
        
        // Toast com informações detalhadas
        toast.error(errorInfo.title, {
          description: errorInfo.description,
          action: errorInfo.action ? {
            label: 'Ver Solução',
            onClick: () => {
              toast.info('Solução', {
                description: errorInfo.action
              });
            }
          } : undefined,
          duration: 8000 // 8 segundos para dar tempo de ler
        });
        
        return;
      }
      
      // Se tiver mensagem personalizada da API (novo padrão)
      if (apiError.mensagem) {
        // Determina o título baseado no código ou usa genérico
        const title = apiError.codigo ? `Erro: ${apiError.codigo}` : 'Erro na Operação';
        
        toast.error(title, {
          description: apiError.mensagem,
          action: apiError.detalhes ? {
            label: 'Ver Detalhes',
            onClick: () => {
              toast.info('Detalhes do Erro', {
                description: typeof apiError.detalhes === 'string' 
                  ? apiError.detalhes 
                  : JSON.stringify(apiError.detalhes, null, 2)
              });
            }
          } : undefined,
          duration: 6000
        });
        return;
      }
    }
    
    // Erros HTTP específicos
    switch (response?.status) {
      case 400:
        toast.error('Dados Inválidos', {
          description: 'Verifique os dados fornecidos e tente novamente.',
          duration: 5000
        });
        break;
      case 401:
        toast.error('Não Autorizado', {
          description: 'Você não tem permissão para realizar esta ação.',
          duration: 5000
        });
        break;
      case 403:
        toast.error('Acesso Negado', {
          description: 'Esta ação não é permitida.',
          duration: 5000
        });
        break;
      case 404:
        toast.error('Não Encontrado', {
          description: 'O recurso solicitado não foi encontrado.',
          duration: 5000
        });
        break;
      case 409:
        toast.error('Conflito', {
          description: 'Já existe um registro com estas informações.',
          duration: 5000
        });
        break;
      case 500:
        toast.error('Erro no Servidor', {
          description: 'Ocorreu um erro interno. Tente novamente em alguns instantes.',
          duration: 6000
        });
        break;
      default:
        toast.error('Erro de Conexão', {
          description: 'Não foi possível conectar com o servidor. Verifique sua conexão.',
          duration: 5000
        });
    }
    
    return;
  }
  
  // Erro genérico
  toast.error('Erro Inesperado', {
    description: 'Ocorreu um erro inesperado. Tente novamente.',
    duration: 5000
  });
}

// Função para mostrar toast de sucesso com ação opcional
export function showSuccessToast(title: string, description?: string, action?: { label: string; onClick: () => void }): void {
  toast.success(title, {
    description,
    action,
    duration: 4000
  });
}

// Função para mostrar toast informativo
export function showInfoToast(title: string, description?: string, action?: { label: string; onClick: () => void }): void {
  toast.info(title, {
    description,
    action,
    duration: 5000
  });
}

// Função para mostrar toast de aviso
export function showWarningToast(title: string, description?: string, action?: { label: string; onClick: () => void }): void {
  toast.warning(title, {
    description,
    action,
    duration: 6000
  });
}
