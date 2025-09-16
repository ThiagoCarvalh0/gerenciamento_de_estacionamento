# Sistema de Controle de Estacionamento

Sistema web desenvolvido em Next.js para controle de entrada e saída de veículos em estacionamentos, com cálculo automático de preços baseado em tabelas de vigência.

## 🚀 Funcionalidades

### ✅ Entrada de Veículos
- Registro de entrada com validação automática de placa
- Suporte a placas no formato brasileiro (ABC1234)
- Verificação de duplicidade (impede entrada dupla do mesmo veículo)
- Limitação de caracteres (7 caracteres máximo)

### ✅ Saída de Veículos
- Busca de veículo por placa com validação
- Cálculo automático do valor usando endpoint específico
- Exibição de informações completas (entrada, saída, valor)
- Verificação de status (já saiu do estacionamento)

### ✅ Gestão de Preços
- CRUD completo (Criar, Ler, Atualizar, Excluir)
- Controle de vigência com detecção de conflitos
- Valores diferenciados para hora inicial e horas adicionais
- Limitação de valores (R$ 0,01 - R$ 999,99)
- Priorização automática de preços vigentes

### ✅ Lista de Veículos
- Visualização de todos os veículos (entrada e saída)
- Ordenação por data (mais recente primeiro)
- Status visual claro (entrada/saída)
- Formatação adequada de datas e valores

## 🧮 Regras de Cobrança

### Tolerância de 30 minutos
- **Até 30 minutos**: Cobra metade do valor da hora inicial
- **Exemplo**: Se hora inicial = R$ 2,00, até 30min = R$ 1,00

### Tolerância de 10 minutos por hora
- **1h10min**: Cobra como 1 hora (tolerância de 10min)
- **1h15min**: Cobra como 2 horas (5min extras)
- **2h5min**: Cobra como 2 horas (tolerância de 10min)
- **2h15min**: Cobra como 3 horas (5min extras)

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes de interface
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de dados
- **Axios** - Cliente HTTP
- **Sonner** - Notificações toast
- **Lucide React** - Ícones

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd teste_benner_front_end
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure a URL da API**
   Crie um arquivo `.env.local` na raiz do projeto baseado no arquivo `env.example`:
   ```env
   # URL da API Backend - TesteTecnicoBenner
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
   
   **Portas comuns para APIs .NET:**
   - `http://localhost:5000` - .NET Core/5+ (HTTP)
   - `http://localhost:5001` - .NET Core/5+ (HTTPS)
   - `http://localhost:8080` - Outras tecnologias

4. **Execute o projeto**
   ```bash
   pnpm dev
   ```

5. **Acesse a aplicação**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## 🔧 Configuração da API

O sistema espera que a API backend esteja rodando na URL configurada no arquivo `.env.local`. A API deve implementar os seguintes endpoints:

### Preços
- `GET /api/Precos` - Lista todos os preços
- `GET /api/Precos/paginated` - Lista com paginação
- `GET /api/Precos/vigentes` - Lista preços vigentes
- `GET /api/Precos/recentes` - Lista preços recentes
- `GET /api/Precos/{id}` - Busca preço por ID
- `POST /api/Precos` - Cria novo preço
- `PUT /api/Precos/{id}` - Atualiza preço
- `DELETE /api/Precos/{id}` - Exclui preço

### Veículos
- `GET /api/Veiculos` - Lista todos os veículos
- `GET /api/Veiculos/{placa}` - Busca veículo por placa
- `GET /api/Veiculos/{placa}/valor-atual` - Calcula valor atual
- `POST /api/Veiculos/entrada` - Registra entrada
- `POST /api/Veiculos/saida` - Registra saída

## 📱 Interface

### Painel Único de Gerenciamento
- **Interface unificada**: Todos os módulos em uma única tela
- **Entrada de Veículos**: Registro com validação em tempo real
- **Saída de Veículos**: Busca e registro com cálculo automático
- **Gestão de Preços**: CRUD completo com controle de vigência
- **Lista de Veículos**: Visualização ordenada por data

### Validações e Feedback
- **Placas**: Validação automática (formato ABC1234)
- **Duplicidade**: Verificação na entrada
- **Datas**: Validação de vigência nos preços
- **Valores**: Limitação e formatação automática
- **Notificações**: Toast para feedback de ações

## 🎯 Exemplos de Uso

### 1. Cadastrar Tabela de Preços
1. Na seção "Gestão de Preços", preencha as datas de vigência
2. Defina os valores da hora inicial e adicional (R$ 0,01 - R$ 999,99)
3. Clique em "Cadastrar Preço"
4. Visualize o status "VIGENTE" se aplicável

### 2. Registrar Entrada
1. Na seção "Entrada de Veículos", digite a placa (ABC1234)
2. O sistema valida automaticamente o formato
3. Clique em "Registrar Entrada"
4. Receba confirmação via toast

### 3. Registrar Saída
1. Na seção "Saída de Veículos", digite a placa
2. Clique em "Buscar" para localizar o veículo
3. Visualize as informações (entrada, valor cobrado)
4. Clique em "Registrar Saída"
5. O sistema calcula e registra automaticamente

## 📊 Estrutura do Projeto

```
teste_benner_front_end/
├── app/                    # Páginas Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Dashboard principal
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── EntradaVeiculo.tsx # Registro de entrada
│   ├── SaidaVeiculo.tsx   # Registro de saída
│   ├── GestaoPrecos.tsx   # Gestão de preços
│   ├── ListaVeiculos.tsx  # Lista de veículos
│   ├── Navigation.tsx     # Navegação
│   └── Header.tsx         # Cabeçalho
├── lib/                   # Utilitários e serviços
│   ├── api.ts            # Serviços da API
│   ├── types.ts          # Tipos TypeScript
│   ├── utils.ts          # Utilitários gerais
│   └── pricing.ts        # Lógica de preços
├── hooks/                # Hooks customizados
│   └── use-mobile.ts     # Hook para mobile
├── components.json       # Configuração shadcn/ui
├── env.example          # Exemplo de variáveis
└── package.json         # Dependências
```

## 🚀 Deploy

Para fazer deploy da aplicação:

1. **Build da aplicação**
   ```bash
   pnpm build
   ```

2. **Iniciar em produção**
   ```bash
   pnpm start
   ```

## 📝 Notas Importantes

- O sistema utiliza a data de entrada do veículo para determinar qual tabela de preços aplicar
- A tolerância de 10 minutos é aplicada automaticamente no cálculo pela API
- Todas as validações são feitas no frontend e backend
- O sistema suporta apenas placas brasileiras no formato antigo (ABC1234)
- A API faz todos os cálculos de preços automaticamente
- Interface unificada em painel único para melhor usabilidade
- Notificações toast para feedback de todas as ações
- Validação em tempo real com limitação de caracteres