using Microsoft.EntityFrameworkCore;
using TesteTecnicoBenner.Domain.Models;

namespace TesteTecnicoBenner.Infrastructure.Data
{
    public class EstacionamentoContext : DbContext
    {
        public EstacionamentoContext(DbContextOptions<EstacionamentoContext> options) : base(options) { }
        public DbSet<Veiculo> Veiculos { get; set; }
        public DbSet<Preco> Precos { get; set; }
    }
}
