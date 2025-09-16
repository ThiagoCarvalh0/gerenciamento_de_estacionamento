using Microsoft.AspNetCore.Mvc;
using TesteTecnicoBenner.Application.Services;
using TesteTecnicoBenner.Application.DTOs;
using TesteTecnicoBenner.Helpers;
using TesteTecnicoBenner.Application.Enums;

namespace TesteTecnicoBenner.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VeiculosController : ControllerBase
    {
        private readonly CalculoPrecoService _service;
        private readonly ApiResponseHelper _responseHelper;

        public VeiculosController(CalculoPrecoService service, ApiResponseHelper responseHelper)
        {
            _service = service;
            _responseHelper = responseHelper;
        }

        [HttpPost("entrada")]
        public async Task<IActionResult> RegistrarEntrada([FromBody] EntradaVeiculoDto dto)
        {
            try
            {
                await _service.RegistrarEntrada(dto.Placa);
                var responseData = new { 
                    Placa = dto.Placa,
                    DataEntrada = DateTime.Now
                };
                return _responseHelper.Success(responseData, "Entrada registrada com sucesso");
            }
            catch (Exception ex)
            {
                // Verificar se é erro de preço vigente para retornar status específico
                if (ex.Message.Contains("não há tabela de preços vigente"))
                {
                    return _responseHelper.ServiceUnavailable(
                        ex.Message, 
                        ErrorCodes.PRECO_NAO_VIGENTE,
                        "Configure uma tabela de preços vigente através da API de preços. Endpoint: POST /api/precos"
                    );
                }
                
                if (ex.Message.Contains("já está no estacionamento"))
                {
                    return _responseHelper.BadRequest(
                        ex.Message, 
                        ErrorCodes.VEICULO_JA_ESTACIONADO
                    );
                }
                
                return _responseHelper.BadRequest(
                    ex.Message, 
                    ErrorCodes.ERRO_ENTRADA_VEICULO
                );
            }
        }

        [HttpPost("saida")]
        public async Task<IActionResult> RegistrarSaida([FromBody] SaidaVeiculoDto dto)
        {
            try
            {
                var valor = await _service.RegistrarSaida(dto.Placa);
                var responseData = new {
                    Placa = dto.Placa,
                    ValorCobrado = valor,
                    DataSaida = DateTime.Now
                };
                return _responseHelper.Success(responseData, "Saída registrada com sucesso");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado") || ex.Message.Contains("já saiu"))
                {
                    return _responseHelper.NotFound(
                        ex.Message, 
                        ErrorCodes.VEICULO_NAO_ENCONTRADO
                    );
                }
                
                return _responseHelper.BadRequest(
                    ex.Message, 
                    ErrorCodes.ERRO_SAIDA_VEICULO
                );
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetTodos()
        {
            var veiculos = await _service.ObterTodosVeiculos();
            return _responseHelper.Success(veiculos, "Veículos listados com sucesso");
        }

        [HttpGet("{placa}")]
        public async Task<IActionResult> GetPorPlaca(string placa)
        {
            var veiculo = await _service.ObterVeiculoPorPlaca(placa);
            if (veiculo == null)
                return _responseHelper.NotFound(
                    $"Veículo com placa {placa} não está no estacionamento",
                    ErrorCodes.VEICULO_NAO_ENCONTRADO
                );

            return _responseHelper.Success(veiculo, "Veículo encontrado com sucesso");
        }

        [HttpGet("{placa}/valor-atual")]
        public async Task<IActionResult> GetValorAtual(string placa)
        {
            try
            {
                var valor = await _service.CalcularValorAtual(placa);
                var responseData = new { 
                    Placa = placa, 
                    ValorAtual = valor
                };
                return _responseHelper.Success(responseData, "Valor calculado com base no tempo atual de permanência");
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("não encontrado") || ex.Message.Contains("já saiu"))
                {
                    return _responseHelper.NotFound(
                        ex.Message, 
                        ErrorCodes.VEICULO_NAO_ENCONTRADO
                    );
                }
                
                return _responseHelper.BadRequest(
                    ex.Message, 
                    ErrorCodes.ERRO_SAIDA_VEICULO
                );
            }
        }

        [HttpGet("status-precos")]
        public async Task<IActionResult> GetStatusPrecos()
        {
            try
            {
                var temPrecoVigente = await _service.VerificarPrecoVigente();
                var precoVigente = await _service.ObterPrecoVigenteAtual();
                
                var responseData = new { 
                    TemPrecoVigente = temPrecoVigente,
                    PrecoVigente = precoVigente != null ? new {
                        precoVigente.Id,
                        precoVigente.VigenciaInicio,
                        precoVigente.VigenciaFim,
                        precoVigente.ValorHoraInicial,
                        precoVigente.ValorHoraAdicional
                    } : null
                };
                
                var message = temPrecoVigente ? 
                    "Sistema operacional com preços vigentes" : 
                    "Atenção: Não há preços vigentes no momento. Configure uma tabela de preços para permitir entradas.";
                
                return _responseHelper.Success(responseData, message);
            }
            catch (Exception ex)
            {
                return _responseHelper.InternalServerError(
                    "Erro ao verificar status dos preços",
                    ex.Message
                );
            }
        }
    }
}
