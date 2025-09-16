using Xunit;

namespace TesteTecnicoBenner.Tests
{
    public class SimpleTest
    {
        [Fact]
        public void TesteSimples_DevePassar()
        {
            // Arrange
            var valor = 1 + 1;

            // Act
            var resultado = valor;

            // Assert
            Assert.Equal(2, resultado);
        }
    }
}
