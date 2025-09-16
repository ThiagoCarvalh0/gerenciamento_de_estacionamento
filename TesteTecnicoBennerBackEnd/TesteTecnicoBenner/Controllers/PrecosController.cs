using Microsoft.AspNetCore.Mvc;
using TesteTecnicoBenner.Application.Services;
using TesteTecnicoBenner.Application.DTOs;
using TesteTecnicoBenner.Helpers;
using TesteTecnicoBenner.Application.Enums;

namespace TesteTecnicoBenner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrecosController : ControllerBase
    {
        private readonly PrecoService _precoService;
        private readonly ApiResponseHelper _responseHelper;

        public PrecosController(PrecoService precoService, ApiResponseHelper responseHelper)
        {
            _precoService = precoService;
            _responseHelper = responseHelper;
        }

        [HttpGet]
        public async Task<IActionResult> GetPrecos()
        {
            var precos = await _precoService.ListarTodosAtivosAsync();
            return _responseHelper.Success(precos, "Preços listados com sucesso");
        }

        [HttpGet("paginated")]
        public async Task<IActionResult> GetPrecosPaginado(
            [FromQuery] int page = 1,
            [FromQuery] int limit = 10,
            [FromQuery] string orderBy = "id",
            [FromQuery] string order = "desc")
        {
            if (page < 1) page = 1;
            if (limit < 1 || limit > 100) limit = 10;

            var filtro = new FiltroPaginacaoDto
            {
                Page = page,
                Limit = limit,
                OrderBy = orderBy,
                Order = order
            };

            var resultado = await _precoService.ListarPaginadoAsync(filtro);
            return _responseHelper.Success(resultado, "Preços paginados listados com sucesso");
        }

        [HttpGet("vigentes")]
        public async Task<IActionResult> GetPrecosVigentes()
        {
            var precos = await _precoService.ListarVigentesAsync();
            return _responseHelper.Success(precos, "Preços vigentes listados com sucesso");
        }

        [HttpGet("recentes")]
        public async Task<IActionResult> GetPrecosRecentes([FromQuery] int dias = 30)
        {
            if (dias < 1) dias = 30;
            
            var precos = await _precoService.ListarRecentesAsync(dias);
            return _responseHelper.Success(precos, $"Preços dos últimos {dias} dias listados com sucesso");
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPreco(int id)
        {
            var preco = await _precoService.ObterPorIdAsync(id);
            if (preco == null)
                return _responseHelper.NotFound(
                    "Preço não encontrado",
                    ErrorCodes.PRECO_NAO_ENCONTRADO
                );

            return _responseHelper.Success(preco, "Preço encontrado com sucesso");
        }

        [HttpPost]
        public async Task<IActionResult> CriarPreco([FromBody] CriarPrecoDto dto)
        {
            if (!ModelState.IsValid)
                return _responseHelper.ValidationError(
                    "Dados de entrada inválidos",
                    ErrorCodes.VALIDACAO_FALHOU,
                    ModelState
                );

            // Validações de negócio
            if (dto.VigenciaInicio >= dto.VigenciaFim)
                return _responseHelper.BadRequest(
                    "Data de início deve ser anterior à data de fim",
                    ErrorCodes.VIGENCIA_INVALIDA
                );

            if (dto.ValorHoraInicial <= 0 || dto.ValorHoraAdicional <= 0)
                return _responseHelper.BadRequest(
                    "Valores devem ser maiores que zero",
                    ErrorCodes.VALORES_INVALIDOS
                );

            try
            {
                var preco = await _precoService.CriarAsync(dto);
                return _responseHelper.Success(preco, "Preço criado com sucesso");
            }
            catch (Exception ex)
            {
                return _responseHelper.InternalServerError(
                    "Erro ao criar preço",
                    ex.Message
                );
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AtualizarPreco(int id, [FromBody] AtualizarPrecoDto dto)
        {
            if (!ModelState.IsValid)
                return _responseHelper.ValidationError(
                    "Dados de entrada inválidos",
                    ErrorCodes.VALIDACAO_FALHOU,
                    ModelState
                );

            try
            {
                var preco = await _precoService.AtualizarAsync(id, dto);
                if (preco == null)
                    return _responseHelper.NotFound(
                        "Preço não encontrado",
                        ErrorCodes.PRECO_NAO_ENCONTRADO
                    );

                return _responseHelper.Success(preco, "Preço atualizado com sucesso");
            }
            catch (Exception ex)
            {
                return _responseHelper.InternalServerError(
                    "Erro ao atualizar preço",
                    ex.Message
                );
            }
        }
        
        [HttpDelete("{id}")]
        public async Task<IActionResult> ExcluirPreco(int id)
        {
            try
            {
                var sucesso = await _precoService.ExcluirAsync(id);
                if (!sucesso)
                    return _responseHelper.NotFound(
                        "Preço não encontrado",
                        ErrorCodes.PRECO_NAO_ENCONTRADO
                    );

                return _responseHelper.Success("Preço excluído com sucesso");
            }
            catch (Exception ex)
            {
                return _responseHelper.InternalServerError(
                    "Erro ao excluir preço",
                    ex.Message
                );
            }
        }
    }
}
