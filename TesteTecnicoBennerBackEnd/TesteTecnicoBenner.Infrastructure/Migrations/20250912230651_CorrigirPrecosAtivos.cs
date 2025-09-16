using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TesteTecnicoBenner.Migrations
{
    /// <inheritdoc />
    public partial class CorrigirPrecosAtivos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Corrigir preços existentes que foram marcados como inativos
            migrationBuilder.Sql("UPDATE Precos SET Ativo = 1 WHERE Ativo = 0");
            
            // Atualizar datas de criação e atualização para preços existentes
            migrationBuilder.Sql("UPDATE Precos SET DataCriacao = datetime('now'), DataAtualizacao = datetime('now') WHERE DataCriacao = '0001-01-01 00:00:00'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
