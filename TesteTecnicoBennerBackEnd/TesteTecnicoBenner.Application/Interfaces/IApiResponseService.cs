using TesteTecnicoBenner.Application.DTOs;

namespace TesteTecnicoBenner.Application.Interfaces
{
    public interface IApiResponseService
    {
        object CreateSuccessResponse<T>(T data, string message = "Operação realizada com sucesso");
        object CreateSuccessResponse(string message = "Operação realizada com sucesso");
        object CreateErrorResponse(string message, string code, string? details = null, string? path = null);
        object CreateNotFoundResponse(string message, string code, string? details = null, string? path = null);
        object CreateServiceUnavailableResponse(string message, string code, string? details = null, string? path = null);
        object CreateInternalServerErrorResponse(string message = "Ocorreu um erro interno no servidor", string? details = null, string? path = null);
        object CreateValidationErrorResponse(string message, string code, object? modelState = null, string? path = null);
    }
}
