namespace TesteTecnicoBenner.Domain.Models
{
    public class Veiculo
    {
        public int Id { get; set; }
        public string Placa { get; set; } = string.Empty;
        public DateTime Entrada { get; set; }
        public DateTime? Saida { get; set; }
        public decimal ValorCobrado { get; set; }
    }
}
