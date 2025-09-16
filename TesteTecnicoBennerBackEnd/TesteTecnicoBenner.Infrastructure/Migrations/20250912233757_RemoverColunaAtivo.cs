using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TesteTecnicoBenner.Migrations
{
    /// <inheritdoc />
    public partial class RemoverColunaAtivo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ativo",
                table: "Precos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Ativo",
                table: "Precos",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }
    }
}
