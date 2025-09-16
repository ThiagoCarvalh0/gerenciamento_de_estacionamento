namespace TesteTecnicoBenner.Application.DTOs
{
    public class PaginacaoDto<T>
    {
        public List<T> Data { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalPages { get; set; }
    }

    public class FiltroPaginacaoDto
    {
        public int Page { get; set; } = 1;
        public int Limit { get; set; } = 10;
        public string OrderBy { get; set; } = "id";
        public string Order { get; set; } = "desc";
    }
}

