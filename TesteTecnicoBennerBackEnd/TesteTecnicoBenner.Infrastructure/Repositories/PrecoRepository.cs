using Microsoft.EntityFrameworkCore;
using TesteTecnicoBenner.Domain.Models;
using TesteTecnicoBenner.Domain.Interfaces;
using TesteTecnicoBenner.Infrastructure.Data;

namespace TesteTecnicoBenner.Infrastructure.Repositories
{
    public class PrecoRepository : IPrecoRepository
    {
        private readonly EstacionamentoContext _context;

        public PrecoRepository(EstacionamentoContext context)
        {
            _context = context;
        }

        public async Task<Preco?> ObterPrecoVigenteAsync(DateTime data)
        {
            return await _context.Precos
                .Where(p => p.VigenciaInicio <= data && p.VigenciaFim >= data)
                .FirstOrDefaultAsync();
        }

        public async Task<List<Preco>> ListarTodosAsync()
        {
            return await _context.Precos
                .OrderByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task AdicionarAsync(Preco preco)
        {
            preco.DataCriacao = DateTime.Now;
            preco.DataAtualizacao = DateTime.Now;
            await _context.Precos.AddAsync(preco);
        }

        public async Task SalvarAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task<(List<Preco> precos, int total)> ListarPaginadoAsync(int page, int limit, string orderBy, string order)
        {
            var query = _context.Precos.AsQueryable();

            // Aplicar ordenação
            query = orderBy.ToLower() switch
            {
                "vigenciainicio" => order.ToLower() == "asc" 
                    ? query.OrderBy(p => p.VigenciaInicio)
                    : query.OrderByDescending(p => p.VigenciaInicio),
                "vigenciafim" => order.ToLower() == "asc"
                    ? query.OrderBy(p => p.VigenciaFim)
                    : query.OrderByDescending(p => p.VigenciaFim),
                "valorhorainicial" => order.ToLower() == "asc"
                    ? query.OrderBy(p => p.ValorHoraInicial)
                    : query.OrderByDescending(p => p.ValorHoraInicial),
                "datacriacao" => order.ToLower() == "asc"
                    ? query.OrderBy(p => p.DataCriacao)
                    : query.OrderByDescending(p => p.DataCriacao),
                _ => query.OrderByDescending(p => p.Id) // Default: ID descendente
            };

            var total = await query.CountAsync();
            var precos = await query
                .Skip((page - 1) * limit)
                .Take(limit)
                .ToListAsync();

            return (precos, total);
        }

        public async Task<List<Preco>> ListarVigentesAsync()
        {
            var agora = DateTime.Now; // Usar horário local em vez de UTC
            return await _context.Precos
                .Where(p => p.VigenciaInicio <= agora && p.VigenciaFim >= agora)
                .OrderByDescending(p => p.Id)
                .ToListAsync();
        }

        public async Task<List<Preco>> ListarRecentesAsync(int dias = 30)
        {
            var dataLimite = DateTime.Now.AddDays(-dias);
            return await _context.Precos
                .Where(p => p.DataCriacao >= dataLimite)
                .OrderByDescending(p => p.DataCriacao)
                .ToListAsync();
        }

        public async Task<Preco?> ObterPorIdAsync(int id)
        {
            return await _context.Precos
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();
        }

        public Task AtualizarAsync(Preco preco)
        {
            preco.DataAtualizacao = DateTime.Now;
            _context.Precos.Update(preco);
            return Task.CompletedTask;
        }

        public async Task ExcluirAsync(int id)
        {
            var preco = await _context.Precos.FindAsync(id);
            if (preco != null)
            {
                _context.Precos.Remove(preco);
            }
        }

        public async Task<bool> ExisteAsync(int id)
        {
            return await _context.Precos
                .Where(p => p.Id == id)
                .AnyAsync();
        }
    }
}
