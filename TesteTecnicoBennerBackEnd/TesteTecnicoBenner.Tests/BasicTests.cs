using Xunit;
using FluentAssertions;
using TesteTecnicoBenner.Domain.Models;

namespace TesteTecnicoBenner.Tests
{
    public class BasicTests
    {
        [Fact]
        public void Veiculo_DeveTerPropriedadesCorretas()
        {
            // Arrange
            var veiculo = new Veiculo
            {
                Id = 1,
                Placa = "ABC-1234",
                Entrada = DateTime.Now,
                ValorCobrado = 10.50m
            };

            // Act & Assert
            veiculo.Id.Should().Be(1);
            veiculo.Placa.Should().Be("ABC-1234");
            veiculo.Entrada.Should().BeCloseTo(DateTime.Now, TimeSpan.FromSeconds(1));
            veiculo.ValorCobrado.Should().Be(10.50m);
        }

        [Fact]
        public void Preco_DeveTerPropriedadesCorretas()
        {
            // Arrange
            var preco = new Preco
            {
                Id = 1,
                VigenciaInicio = DateTime.Now,
                VigenciaFim = DateTime.Now.AddDays(30),
                ValorHoraInicial = 5.00m,
                ValorHoraAdicional = 2.50m
            };

            // Act & Assert
            preco.Id.Should().Be(1);
            preco.VigenciaInicio.Should().BeCloseTo(DateTime.Now, TimeSpan.FromSeconds(1));
            preco.VigenciaFim.Should().BeCloseTo(DateTime.Now.AddDays(30), TimeSpan.FromSeconds(1));
            preco.ValorHoraInicial.Should().Be(5.00m);
            preco.ValorHoraAdicional.Should().Be(2.50m);
        }

        [Theory]
        [InlineData("ABC-1234", true)]
        [InlineData("XYZ-5678", true)]
        [InlineData("", false)]
        [InlineData(null, false)]
        public void Placa_DeveSerValida(string placa, bool esperado)
        {
            // Arrange
            var veiculo = new Veiculo { Placa = placa ?? string.Empty };

            // Act
            var resultado = !string.IsNullOrEmpty(veiculo.Placa);

            // Assert
            resultado.Should().Be(esperado);
        }
    }
}
