# 🚗 Sistema de Estacionamento - Teste Técnico Benner

[![.NET](https://img.shields.io/badge/.NET-8.0-blue.svg)](https://dotnet.microsoft.com/download)
[![Entity Framework](https://img.shields.io/badge/Entity%20Framework-9.0.9-green.svg)](https://docs.microsoft.com/en-us/ef/)
[![SQLite](https://img.shields.io/badge/SQLite-3-lightblue.svg)](https://www.sqlite.org/)
[![Swagger](https://img.shields.io/badge/Swagger-9.0.4-orange.svg)](https://swagger.io/)

## 📋 Visão Geral

Sistema completo de gerenciamento de estacionamento desenvolvido em .NET 8 com arquitetura limpa, padrões de resposta consistentes e validações robustas.

### ✨ Funcionalidades Principais

- **Gestão de Veículos**: Entrada, saída e consulta de veículos
- **Gestão de Preços**: Tabelas de preços com vigência
- **Cálculo Automático**: Preços baseados em tempo de permanência
- **Validações**: Prevenção de entrada sem preços vigentes
- **Monitoramento**: Status do sistema em tempo real
- **Padrão de Respostas**: API consistente e bem documentada

## 🏗️ Arquitetura

### 🎯 Clean Architecture

```
┌─────────────────────────────────────────┐
│           🌐 API Layer                  │ ← Controllers, Middleware
│        (VeiculosController,             │
│         PrecosController)               │
├─────────────────────────────────────────┤
│         📱 Application Layer            │ ← Services, DTOs, Helpers
│        (CalculoPrecoService,            │
│         ApiResponseHelper)              │
├─────────────────────────────────────────┤
│          🏢 Domain Layer                │ ← Models, Interfaces
│      (Veiculo, Preco, ErrorCodes)       │
├─────────────────────────────────────────┤
│        🗄️ Infrastructure Layer         │ ← Repositories, Database
│    (VeiculoRepository, AppDbContext)    │
└─────────────────────────────────────────┘
```

### 📁 Estrutura do Projeto

```
TesteTecnicoBenner/
├── 🌐 TesteTecnicoBenner.API/           # Camada de apresentação
│   ├── Controllers/                     # Endpoints da API
│   ├── Middleware/                      # Middleware global
│   └── Program.cs                       # Configuração da aplicação
├── 📱 TesteTecnicoBenner.Application/   # Camada de aplicação
│   ├── Services/                        # Lógica de negócio
│   ├── DTOs/                           # Objetos de transferência
│   ├── Helpers/                        # Utilitários
│   └── Enums/                          # Códigos de erro
├── 🏢 TesteTecnicoBenner.Domain/        # Camada de domínio
│   ├── Models/                         # Entidades
│   └── Interfaces/                     # Contratos
└── 🗄️ TesteTecnicoBenner.Infrastructure/ # Camada de infraestrutura
    ├── Data/                           # Contexto do banco
    ├── Repositories/                   # Implementações
    └── Migrations/                     # Migrações
```

## Quick Start

### Pré-requisitos

- ✅ .NET 8 SDK
- ✅ Visual Studio 2022 ou VS Code
- ✅ Git

### Instalação

```bash
# 1. Clone o repositório
git clone [url-do-repositorio]
cd TesteTecnicoBenner

# 2. Restaure as dependências
dotnet restore

# 3. Execute o projeto
dotnet run --project TesteTecnicoBenner

# 4. Acesse a aplicação
# 🌐 API: https://localhost:7000
# 📚 Swagger: https://localhost:7000/swagger
```

## API Endpoints

### Veículos

| Método | Endpoint | Descrição | Status Code |
|--------|----------|-----------|-------------|
| `POST` | `/api/veiculos/entrada` | Registrar entrada | `200`, `503` |
| `POST` | `/api/veiculos/saida` | Registrar saída | `200`, `404` |
| `GET` | `/api/veiculos` | Listar veículos | `200` |
| `GET` | `/api/veiculos/{placa}` | Buscar por placa | `200`, `404` |
| `GET` | `/api/veiculos/{placa}/valor-atual` | Calcular valor atual | `200`, `404` |
| `GET` | `/api/veiculos/status-precos` | Status dos preços | `200` |

### Preços

| Método | Endpoint | Descrição | Status Code |
|--------|----------|-----------|-------------|
| `GET` | `/api/precos` | Listar preços | `200` |
| `GET` | `/api/precos/paginated` | Listar paginado | `200` |
| `GET` | `/api/precos/vigentes` | Preços vigentes | `200` |
| `GET` | `/api/precos/recentes` | Preços recentes | `200` |
| `GET` | `/api/precos/{id}` | Buscar por ID | `200`, `404` |
| `POST` | `/api/precos` | Criar preço | `200`, `400` |
| `PUT` | `/api/precos/{id}` | Atualizar preço | `200`, `404` |
| `DELETE` | `/api/precos/{id}` | Excluir preço | `200`, `404` |

## 📝 Exemplos de Uso

### 1. Registrar Entrada de Veículo

```bash
POST /api/veiculos/entrada
Content-Type: application/json

{
  "placa": "ABC-1234"
}
```

**✅ Resposta de Sucesso:**
```json
{
  "sucesso": true,
  "mensagem": "Entrada registrada com sucesso",
  "dados": {
    "placa": "ABC-1234",
    "dataEntrada": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**❌ Resposta de Erro (Sem Preços Vigentes):**
```json
{
  "sucesso": false,
  "mensagem": "Não é possível registrar entrada: não há tabela de preços vigente no momento. Configure uma tabela de preços antes de permitir entradas.",
  "codigo": "PRECO_NAO_VIGENTE",
  "detalhes": "Configure uma tabela de preços vigente através da API de preços. Endpoint: POST /api/precos",
  "timestamp": "2024-01-15T10:30:00Z",
  "caminho": "/api/veiculos/entrada"
}
```

### 2. Registrar Saída e Calcular Preço

```bash
POST /api/veiculos/saida
Content-Type: application/json

{
  "placa": "ABC-1234"
}
```

**✅ Resposta de Sucesso:**
```json
{
  "sucesso": true,
  "mensagem": "Saída registrada com sucesso",
  "dados": {
    "placa": "ABC-1234",
    "valorCobrado": 15.00,
    "dataSaida": "2024-01-15T12:30:00Z"
  },
  "timestamp": "2024-01-15T12:30:00Z"
}
```

### 3. Cadastrar Tabela de Preços

```bash
POST /api/precos
Content-Type: application/json

{
  "vigenciaInicio": "2024-01-01T00:00:00",
  "vigenciaFim": "2024-12-31T23:59:59",
  "valorHoraInicial": 10.00,
  "valorHoraAdicional": 5.00
}
```

**✅ Resposta de Sucesso:**
```json
{
  "sucesso": true,
  "mensagem": "Preço criado com sucesso",
  "dados": {
    "id": 1,
    "vigenciaInicio": "2024-01-01T00:00:00",
    "vigenciaFim": "2024-12-31T23:59:59",
    "valorHoraInicial": 10.00,
    "valorHoraAdicional": 5.00,
    "vigente": true,
    "dataCriacao": "2024-01-15T10:30:00Z",
    "dataAtualizacao": "2024-01-15T10:30:00Z"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4. Verificar Status dos Preços

```bash
GET /api/veiculos/status-precos
```

**✅ Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Sistema operacional com preços vigentes",
  "dados": {
    "temPrecoVigente": true,
    "precoVigente": {
      "id": 1,
      "vigenciaInicio": "2024-01-01T00:00:00",
      "vigenciaFim": "2024-12-31T23:59:59",
      "valorHoraInicial": 10.00,
      "valorHoraAdicional": 5.00
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🧮 Regras de Negócio

### Cálculo de Preços

1. **Até 30 minutos**: 50% do valor da hora inicial
2. **Até 1 hora**: Valor da hora inicial completo
3. **Acima de 1 hora**: Hora inicial + (horas extras × valor adicional)

**Exemplo de Cálculo:**
- Preço: R$ 10,00 (inicial) + R$ 5,00 (adicional)
- Tempo: 2h 30min
- Cálculo: R$ 10,00 + (2 × R$ 5,00) = R$ 20,00

### Validações de Segurança

- ✅ **Entrada Bloqueada**: Sem preços vigentes
- ✅ **Veículo Único**: Não permite entrada duplicada
- ✅ **Preço de Emergência**: Fallback para casos excepcionais
- ✅ **Validação de Dados**: Campos obrigatórios e formatos

## Padrão de Respostas

### ✅ Estrutura de Sucesso

```json
{
  "sucesso": true,
  "mensagem": "Operação realizada com sucesso",
  "dados": { /* dados da resposta */ },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ❌ Estrutura de Erro

```json
{
  "sucesso": false,
  "mensagem": "Descrição do erro",
  "codigo": "CODIGO_ERRO",
  "detalhes": "Informações adicionais",
  "timestamp": "2024-01-15T10:30:00Z",
  "caminho": "/api/veiculos/entrada",
  "dados": { /* dados de erro, como ModelState */ }
}
```

### Códigos de Erro

| Código | Descrição | Status Code |
|--------|-----------|-------------|
| `VEICULO_NAO_ENCONTRADO` | Veículo não encontrado | `404` |
| `VEICULO_JA_ESTACIONADO` | Veículo já está no estacionamento | `400` |
| `PRECO_NAO_VIGENTE` | Não há preços vigentes | `503` |
| `PRECO_NAO_ENCONTRADO` | Preço não encontrado | `404` |
| `VALIDACAO_FALHOU` | Dados de entrada inválidos | `400` |
| `VIGENCIA_INVALIDA` | Vigência inválida | `400` |
| `VALORES_INVALIDOS` | Valores inválidos | `400` |
| `ERRO_INTERNO` | Erro interno do servidor | `500` |

## Tecnologias

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| **.NET 8** | 8.0 | Framework principal |
| **Entity Framework Core** | 9.0.9 | ORM para banco de dados |
| **SQLite** | 9.0.9 | Banco de dados local |
| **Swagger** | 9.0.4 | Documentação da API |
| **xUnit** | 2.6.1 | Framework de testes |
| **Moq** | 4.20.69 | Biblioteca de mocks |
| **FluentAssertions** | 6.12.0 | Assertions legíveis |

## 🏗️ Padrões Arquiteturais

### 1. **Clean Architecture** 🏗️
- Separação clara de responsabilidades
- Camadas independentes
- Fácil manutenção e evolução

### 2. **Repository Pattern** 📚
- Abstração do acesso a dados
- Facilita testes e manutenção
- Permite trocar banco facilmente

### 3. **Dependency Injection** 💉
- Injeção automática de dependências
- Reduz acoplamento entre classes
- Melhora testabilidade

### 4. **Interface Segregation** 🔌
- Interfaces pequenas e focadas
- Fácil implementação
- Menos acoplamento

## 🔧 Configuração

### Banco de Dados

O sistema usa SQLite com arquivo local. Para trocar o banco:

```csharp
// Program.cs
builder.Services.AddDbContext<EstacionamentoContext>(options =>
    options.UseSqlite("Data Source=estacionamento.db"));
```

### CORS

Configurado para desenvolvimento. Para produção:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", builder =>
    {
        builder.WithOrigins("https://seudominio.com")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

## 🚨 Troubleshooting

### ❌ Erro: "Não foi possível localizar o projeto"

**Solução:**
```bash
dotnet clean
dotnet restore
dotnet build
```

## 📊 Métricas de Qualidade

### ✅ Pontos Fortes

- **Arquitetura Limpa**: Separação clara de responsabilidades
- **Validações Robustas**: Prevenção de erros na raiz
- **Padrão Consistente**: Respostas padronizadas
- **Testabilidade**: Interfaces e DI facilitam testes
- **Documentação**: Código bem documentado
- **Segurança**: Validações de entrada e regras de negócio

### 🎯 Melhorias Implementadas

- **Validação de Preços Vigentes**: Entrada bloqueada sem preços
- **Preço de Emergência**: Fallback para casos excepcionais
- **Padrão de Respostas**: API consistente
- **Códigos de Erro**: Tratamento específico por tipo
- **Middleware Global**: Captura de erros não tratados
- **Endpoint de Status**: Monitoramento do sistema