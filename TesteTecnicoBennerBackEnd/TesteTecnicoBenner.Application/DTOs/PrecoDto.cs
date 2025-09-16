namespace TesteTecnicoBenner.Application.DTOs
{
    public class PrecoDto
    {
        public int Id { get; set; }
        public DateTime VigenciaInicio { get; set; }
        public DateTime VigenciaFim { get; set; }
        public decimal ValorHoraInicial { get; set; }
        public decimal ValorHoraAdicional { get; set; }
        public bool Vigente { get; set; } // Calculado dinamicamente baseado na vigência
        public DateTime DataCriacao { get; set; }
        public DateTime DataAtualizacao { get; set; }
    }

    public class CriarPrecoDto
    {
        public DateTime VigenciaInicio { get; set; }
        public DateTime VigenciaFim { get; set; }
        public decimal ValorHoraInicial { get; set; }
        public decimal ValorHoraAdicional { get; set; }
    }

    public class AtualizarPrecoDto
    {
        public DateTime? VigenciaInicio { get; set; }
        public DateTime? VigenciaFim { get; set; }
        public decimal? ValorHoraInicial { get; set; }
        public decimal? ValorHoraAdicional { get; set; }
    }
}

