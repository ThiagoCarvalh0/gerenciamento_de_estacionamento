using TesteTecnicoBenner.Domain.Models;

namespace TesteTecnicoBenner.Domain.Interfaces
{
    public interface IPrecoRepository
    {
        // Métodos existentes
        Task<Preco?> ObterPrecoVigenteAsync(DateTime data);
        Task<List<Preco>> ListarTodosAsync();
        Task AdicionarAsync(Preco preco);
        Task SalvarAsync();
        
        // Novos métodos para paginação e filtros
        Task<(List<Preco> precos, int total)> ListarPaginadoAsync(int page, int limit, string orderBy, string order);
        Task<List<Preco>> ListarVigentesAsync();
        Task<List<Preco>> ListarRecentesAsync(int dias = 30);
        Task<Preco?> ObterPorIdAsync(int id);
        Task AtualizarAsync(Preco preco);
        Task ExcluirAsync(int id); // Soft delete
        Task<bool> ExisteAsync(int id);
    }
}
