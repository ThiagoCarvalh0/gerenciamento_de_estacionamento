using Microsoft.EntityFrameworkCore;
using TesteTecnicoBenner.Domain.Models;
using TesteTecnicoBenner.Domain.Interfaces;
using TesteTecnicoBenner.Infrastructure.Data;

namespace TesteTecnicoBenner.Infrastructure.Repositories
{
    public class VeiculoRepository : IVeiculoRepository
    {
        private readonly EstacionamentoContext _context;

        public VeiculoRepository(EstacionamentoContext context)
        {
            _context = context;
        }

        public async Task<Veiculo?> ObterPorPlacaAsync(string placa)
        {
            return await _context.Veiculos
                .FirstOrDefaultAsync(v => v.Placa.ToUpper() == placa.ToUpper());
        }

        public async Task<Veiculo?> ObterPorPlacaSemSaidaAsync(string placa)
        {
            return await _context.Veiculos
                .FirstOrDefaultAsync(v => v.Placa.ToUpper() == placa.ToUpper() && v.Saida == null);
        }

        public async Task AdicionarAsync(Veiculo veiculo)
        {
            await _context.Veiculos.AddAsync(veiculo);
        }

        public Task AtualizarAsync(Veiculo veiculo)
        {
            _context.Veiculos.Update(veiculo);
            return Task.CompletedTask;
        }

        public async Task<List<Veiculo>> ListarTodosAsync()
        {
            return await _context.Veiculos.ToListAsync();
        }

        public async Task SalvarAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
