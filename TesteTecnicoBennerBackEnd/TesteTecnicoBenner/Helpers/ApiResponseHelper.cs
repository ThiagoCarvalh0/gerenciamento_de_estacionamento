using Microsoft.AspNetCore.Mvc;
using TesteTecnicoBenner.Application.Interfaces;
using TesteTecnicoBenner.Application.Enums;

namespace TesteTecnicoBenner.Helpers
{
    public class ApiResponseHelper
    {
        private readonly IApiResponseService _responseService;

        public ApiResponseHelper(IApiResponseService responseService)
        {
            _responseService = responseService;
        }

        public IActionResult Success<T>(T data, string message = "Operação realizada com sucesso")
        {
            var response = _responseService.CreateSuccessResponse(data, message);
            return new OkObjectResult(response);
        }

        public IActionResult Success(string message = "Operação realizada com sucesso")
        {
            var response = _responseService.CreateSuccessResponse(message);
            return new OkObjectResult(response);
        }

        public IActionResult BadRequest(string message, string code, string? details = null, string? path = null)
        {
            var response = _responseService.CreateErrorResponse(message, code, details, path);
            return new BadRequestObjectResult(response);
        }

        public IActionResult NotFound(string message, string code = ErrorCodes.RECURSO_NAO_ENCONTRADO, string? details = null, string? path = null)
        {
            var response = _responseService.CreateNotFoundResponse(message, code, details, path);
            return new NotFoundObjectResult(response);
        }

        public IActionResult ServiceUnavailable(string message, string code = ErrorCodes.SERVICO_INDISPONIVEL, string? details = null, string? path = null)
        {
            var response = _responseService.CreateServiceUnavailableResponse(message, code, details, path);
            return new ObjectResult(response) { StatusCode = 503 };
        }

        public IActionResult InternalServerError(string message = "Ocorreu um erro interno no servidor", string? details = null, string? path = null)
        {
            var response = _responseService.CreateInternalServerErrorResponse(message, details, path);
            return new ObjectResult(response) { StatusCode = 500 };
        }

        public IActionResult ValidationError(string message, string code = ErrorCodes.VALIDACAO_FALHOU, object? modelState = null, string? path = null)
        {
            var response = _responseService.CreateValidationErrorResponse(message, code, modelState, path);
            return new BadRequestObjectResult(response);
        }
    }
}
