using TesteTecnicoBenner.Application.DTOs;
using TesteTecnicoBenner.Application.Enums;
using TesteTecnicoBenner.Application.Interfaces;

namespace TesteTecnicoBenner.Application.Services
{
    public class ApiResponseService : IApiResponseService
    {
        public object CreateSuccessResponse<T>(T data, string message = "Operação realizada com sucesso")
        {
            return new SuccessResponseDto<T>(data, message);
        }

        public object CreateSuccessResponse(string message = "Operação realizada com sucesso")
        {
            return new SuccessResponseDto<object>(null, message);
        }

        public object CreateErrorResponse(string message, string code, string? details = null, string? path = null)
        {
            return new ErrorResponseDto(message, code, details, path);
        }

        public object CreateNotFoundResponse(string message, string code, string? details = null, string? path = null)
        {
            return new ErrorResponseDto(message, code, details, path);
        }

        public object CreateServiceUnavailableResponse(string message, string code, string? details = null, string? path = null)
        {
            return new ErrorResponseDto(message, code, details, path);
        }

        public object CreateInternalServerErrorResponse(string message = "Ocorreu um erro interno no servidor", string? details = null, string? path = null)
        {
            return new ErrorResponseDto(message, ErrorCodes.ERRO_INTERNO, details, path);
        }

        public object CreateValidationErrorResponse(string message, string code, object? modelState = null, string? path = null)
        {
            return new ErrorResponseDto(message, code, null, path)
            {
                Dados = modelState
            };
        }
    }
}
