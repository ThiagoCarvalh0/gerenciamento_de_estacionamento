using TesteTecnicoBenner.Domain.Models;

namespace TesteTecnicoBenner.Domain.Interfaces
{
    public interface IVeiculoRepository
    {
        Task<Veiculo?> ObterPorPlacaAsync(string placa);
        Task<Veiculo?> ObterPorPlacaSemSaidaAsync(string placa);
        Task AdicionarAsync(Veiculo veiculo);
        Task AtualizarAsync(Veiculo veiculo);
        Task<List<Veiculo>> ListarTodosAsync();
        Task SalvarAsync();
    }
}
