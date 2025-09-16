namespace TesteTecnicoBenner.Domain.Models
{
    public class Preco
    {
        public int Id { get; set; }
        public DateTime VigenciaInicio { get; set; }
        public DateTime VigenciaFim { get; set; }
        public decimal ValorHoraInicial { get; set; }
        public decimal ValorHoraAdicional { get; set; }
        public DateTime DataCriacao { get; set; } = DateTime.Now;
        public DateTime DataAtualizacao { get; set; } = DateTime.Now;
    }
}
