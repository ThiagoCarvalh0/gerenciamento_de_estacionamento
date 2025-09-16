using Xunit;
using Moq;
using FluentAssertions;
using TesteTecnicoBenner.Application.Services;
using TesteTecnicoBenner.Domain.Models;
using TesteTecnicoBenner.Domain.Interfaces;

namespace TesteTecnicoBenner.Tests
{
    public class CalculoPrecoServiceTests
    {
        private readonly Mock<IVeiculoRepository> _veiculoRepositoryMock;
        private readonly Mock<IPrecoRepository> _precoRepositoryMock;
        private readonly CalculoPrecoService _service;

        public CalculoPrecoServiceTests()
        {
            _veiculoRepositoryMock = new Mock<IVeiculoRepository>();
            _precoRepositoryMock = new Mock<IPrecoRepository>();
            _service = new CalculoPrecoService(_veiculoRepositoryMock.Object, _precoRepositoryMock.Object);
        }

        [Fact]
        public async Task RegistrarEntrada_ComPlacaValida_DeveRegistrarEntradaComSucesso()
        {
            // Arrange
            var placa = "ABC-1234";
            var precoVigente = new Preco
            {
                Id = 1,
                VigenciaInicio = DateTime.Now.AddDays(-1),
                VigenciaFim = DateTime.Now.AddDays(30),
                ValorHoraInicial = 5.00m,
                ValorHoraAdicional = 2.50m
            };

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync((Veiculo?)null);
            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(precoVigente);
            _veiculoRepositoryMock.Setup(x => x.AdicionarAsync(It.IsAny<Veiculo>()))
                .Returns(Task.CompletedTask);
            _veiculoRepositoryMock.Setup(x => x.SalvarAsync())
                .Returns(Task.CompletedTask);

            // Act
            await _service.RegistrarEntrada(placa);

            // Assert
            _veiculoRepositoryMock.Verify(x => x.AdicionarAsync(It.Is<Veiculo>(v => v.Placa == placa)), Times.Once);
            _veiculoRepositoryMock.Verify(x => x.SalvarAsync(), Times.Once);
        }

        [Fact]
        public async Task RegistrarEntrada_ComVeiculoJaEstacionado_DeveLancarExcecao()
        {
            // Arrange
            var placa = "ABC-1234";
            var veiculoExistente = new Veiculo
            {
                Id = 1,
                Placa = placa,
                Entrada = DateTime.Now.AddHours(-2)
            };

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync(veiculoExistente);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.RegistrarEntrada(placa));
            exception.Message.Should().Contain("já está no estacionamento");
        }

        [Fact]
        public async Task RegistrarEntrada_SemPrecoVigente_DeveLancarExcecao()
        {
            // Arrange
            var placa = "ABC-1234";

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync((Veiculo?)null);
            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(It.IsAny<DateTime>()))
                .ReturnsAsync((Preco?)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.RegistrarEntrada(placa));
            exception.Message.Should().Contain("não há tabela de preços vigente");
        }

        [Fact]
        public async Task RegistrarSaida_ComVeiculoValido_DeveCalcularValorCorretamente()
        {
            // Arrange
            var placa = "ABC-1234";
            var entrada = DateTime.Now.AddHours(-2);
            var veiculo = new Veiculo
            {
                Id = 1,
                Placa = placa,
                Entrada = entrada
            };
            var precoVigente = new Preco
            {
                Id = 1,
                ValorHoraInicial = 5.00m,
                ValorHoraAdicional = 2.50m
            };

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync(veiculo);
            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(entrada))
                .ReturnsAsync(precoVigente);
            _veiculoRepositoryMock.Setup(x => x.AtualizarAsync(It.IsAny<Veiculo>()))
                .Returns(Task.CompletedTask);
            _veiculoRepositoryMock.Setup(x => x.SalvarAsync())
                .Returns(Task.CompletedTask);

            // Act
            var valor = await _service.RegistrarSaida(placa);

            // Assert
            valor.Should().Be(7.50m); // 5.00 (hora inicial) + 2.50 (hora adicional)
            _veiculoRepositoryMock.Verify(x => x.AtualizarAsync(It.Is<Veiculo>(v => 
                v.Placa == placa && v.Saida.HasValue && v.ValorCobrado == 7.50m)), Times.Once);
        }

        [Fact]
        public async Task RegistrarSaida_ComVeiculoNaoEncontrado_DeveLancarExcecao()
        {
            // Arrange
            var placa = "ABC-1234";

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync((Veiculo?)null);

            // Act & Assert
            var exception = await Assert.ThrowsAsync<Exception>(() => _service.RegistrarSaida(placa));
            exception.Message.Should().Contain("não encontrado");
        }

        [Fact]
        public async Task CalcularValorAtual_ComTempoMenorQue30Minutos_DeveRetornarMeioValorHoraInicial()
        {
            // Arrange
            var placa = "ABC-1234";
            var entrada = DateTime.Now.AddMinutes(-15);
            var veiculo = new Veiculo
            {
                Id = 1,
                Placa = placa,
                Entrada = entrada
            };
            var precoVigente = new Preco
            {
                Id = 1,
                ValorHoraInicial = 10.00m,
                ValorHoraAdicional = 5.00m
            };

            _veiculoRepositoryMock.Setup(x => x.ObterPorPlacaSemSaidaAsync(placa))
                .ReturnsAsync(veiculo);
            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(entrada))
                .ReturnsAsync(precoVigente);

            // Act
            var valor = await _service.CalcularValorAtual(placa);

            // Assert
            valor.Should().Be(5.00m); // 10.00 / 2
        }

        [Fact]
        public async Task VerificarPrecoVigente_ComPrecoExistente_DeveRetornarTrue()
        {
            // Arrange
            var precoVigente = new Preco
            {
                Id = 1,
                VigenciaInicio = DateTime.Now.AddDays(-1),
                VigenciaFim = DateTime.Now.AddDays(30)
            };

            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(It.IsAny<DateTime>()))
                .ReturnsAsync(precoVigente);

            // Act
            var resultado = await _service.VerificarPrecoVigente();

            // Assert
            resultado.Should().BeTrue();
        }

        [Fact]
        public async Task VerificarPrecoVigente_SemPrecoExistente_DeveRetornarFalse()
        {
            // Arrange
            _precoRepositoryMock.Setup(x => x.ObterPrecoVigenteAsync(It.IsAny<DateTime>()))
                .ReturnsAsync((Preco?)null);

            // Act
            var resultado = await _service.VerificarPrecoVigente();

            // Assert
            resultado.Should().BeFalse();
        }
    }
}
