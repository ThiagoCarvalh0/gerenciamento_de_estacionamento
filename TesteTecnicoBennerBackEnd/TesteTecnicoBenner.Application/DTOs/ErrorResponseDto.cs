namespace TesteTecnicoBenner.Application.DTOs
{
    public class ErrorResponseDto
    {
        public bool Sucesso { get; set; } = false;
        public string Mensagem { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string? Detalhes { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Caminho { get; set; } = string.Empty;
        public object? Dados { get; set; }

        public ErrorResponseDto()
        {
        }

        public ErrorResponseDto(string mensagem, string codigo, string? detalhes = null, string? caminho = null)
        {
            Mensagem = mensagem;
            Codigo = codigo;
            Detalhes = detalhes;
            Caminho = caminho ?? string.Empty;
        }
    }

    public class SuccessResponseDto<T>
    {
        public bool Sucesso { get; set; } = true;
        public string Mensagem { get; set; } = string.Empty;
        public T? Dados { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public SuccessResponseDto()
        {
        }

        public SuccessResponseDto(T dados, string mensagem = "Operação realizada com sucesso")
        {
            Dados = dados;
            Mensagem = mensagem;
        }
    }
}
