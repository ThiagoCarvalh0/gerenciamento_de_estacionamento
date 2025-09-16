# Testes do Sistema de Estacionamento

Este projeto contém testes unitários e de integração para o sistema de estacionamento, demonstrando práticas de TDD (Test-Driven Development).

## Estrutura dos Testes

### Arquivos de Teste

#### `CalculoPrecoServiceTests.cs`
Testa a lógica de negócio principal do sistema:
- ✅ Registro de entrada de veículos
- ✅ Registro de saída e cálculo de valores
- ✅ Validações de preços vigentes
- ✅ Cálculos de tempo e valores
- ✅ Tratamento de casos especiais (meia hora, horas adicionais)

#### `BasicTests.cs`
Testes básicos dos modelos de domínio:
- ✅ Validação de propriedades dos modelos
- ✅ Testes de teoria com dados parametrizados
- ✅ Validações de regras de negócio simples

#### `SimpleTest.cs`
Teste simples para verificar se o ambiente está funcionando:
- ✅ Teste básico de matemática
- ✅ Verificação do framework de testes

### Estrutura do Projeto
```
TesteTecnicoBenner.Tests/
├── TesteTecnicoBenner.Tests.csproj
├── CalculoPrecoServiceTests.cs
├── BasicTests.cs
├── SimpleTest.cs
├── README.md
└── run-tests.ps1
```

## Tecnologias Utilizadas

- **xUnit**: Framework de testes
- **Moq**: Mocking de dependências
- **FluentAssertions**: Assertions mais legíveis
- **Microsoft.NET.Test.Sdk**: SDK de testes
- **coverlet.collector**: Coleta de cobertura de código

## Como Executar os Testes

### Via CLI (dotnet)
```bash
# Executar todos os testes
dotnet test

# Executar com cobertura de código
dotnet test --collect:"XPlat Code Coverage"

# Executar apenas testes unitários
dotnet test --filter "Category=Unit"
```

### Via Visual Studio
1. Abra o Test Explorer (Test → Test Explorer)
2. Execute todos os testes ou selecione testes específicos
3. Visualize resultados e cobertura

## Padrões de TDD Demonstrados

### 1. **Arrange-Act-Assert (AAA)**
```csharp
[Fact]
public async Task RegistrarEntrada_ComPlacaValida_DeveRegistrarEntradaComSucesso()
{
    // Arrange - Configurar dados de teste
    var placa = "ABC-1234";
    var precoVigente = new Preco { ... };
    
    // Act - Executar ação sendo testada
    await _service.RegistrarEntrada(placa);
    
    // Assert - Verificar resultados
    _veiculoRepositoryMock.Verify(x => x.AdicionarAsync(It.Is<Veiculo>(v => v.Placa == placa)), Times.Once);
}
```

### 2. **Mocking de Dependências**
```csharp
private readonly Mock<IVeiculoRepository> _veiculoRepositoryMock;
private readonly Mock<IPrecoRepository> _precoRepositoryMock;

// Configurar comportamento do mock
_veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
    .ReturnsAsync((Veiculo?)null);
```

### 3. **Testes de Casos Extremos**
- Veículo já estacionado
- Preço não vigente
- Valores inválidos
- Tempos de permanência específicos

### 4. **Testes de Teoria**
- Dados parametrizados
- Múltiplos cenários em um teste
- Validação de regras de negócio

## Cobertura de Testes

Os testes cobrem:
- ✅ **Lógica de negócio**: Cálculos, validações, regras
- ✅ **Modelos de domínio**: Propriedades e validações
- ✅ **Casos de erro**: Cenários de falha e recuperação
- ✅ **Mocking**: Isolamento de dependências
- ✅ **Assertions**: Validações com FluentAssertions
- ✅ **Testes de teoria**: Dados parametrizados

## Benefícios Demonstrados

1. **Confiabilidade**: Código testado e validado
2. **Manutenibilidade**: Mudanças seguras com testes
3. **Documentação**: Testes servem como documentação viva
4. **Refatoração**: Segurança para melhorar código
5. **Qualidade**: Detecção precoce de bugs

## Para Entrevistas Técnicas

Este projeto demonstra:
- ✅ Conhecimento de TDD e testes unitários
- ✅ Uso de mocks e stubs
- ✅ Padrões de nomenclatura de testes
- ✅ Organização e estrutura de testes
- ✅ Cobertura de cenários críticos
- ✅ Uso de FluentAssertions para código mais legível
- ✅ Testes de teoria com dados parametrizados
