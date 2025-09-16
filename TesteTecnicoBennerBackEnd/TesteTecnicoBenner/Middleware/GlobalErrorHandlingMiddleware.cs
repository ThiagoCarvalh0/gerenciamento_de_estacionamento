using System.Net;
using System.Text.Json;
using TesteTecnicoBenner.Application.DTOs;
using TesteTecnicoBenner.Application.Enums;

namespace TesteTecnicoBenner.Middleware
{
    public class GlobalErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalErrorHandlingMiddleware> _logger;

        public GlobalErrorHandlingMiddleware(RequestDelegate next, ILogger<GlobalErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro não tratado ocorreu: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var response = context.Response;
            response.ContentType = "application/json";

            var errorResponse = new ErrorResponseDto
            {
                Caminho = context.Request.Path,
                Timestamp = DateTime.UtcNow
            };

            switch (exception)
            {
                case ArgumentException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Codigo = ErrorCodes.VALIDACAO_FALHOU;
                    errorResponse.Mensagem = exception.Message;
                    break;

                case KeyNotFoundException:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse.Codigo = ErrorCodes.RECURSO_NAO_ENCONTRADO;
                    errorResponse.Mensagem = exception.Message;
                    break;

                case UnauthorizedAccessException:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse.Codigo = ErrorCodes.NAO_AUTORIZADO;
                    errorResponse.Mensagem = "Acesso não autorizado";
                    break;

                case InvalidOperationException:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse.Codigo = ErrorCodes.VALIDACAO_FALHOU;
                    errorResponse.Mensagem = exception.Message;
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse.Codigo = ErrorCodes.ERRO_INTERNO;
                    errorResponse.Mensagem = "Ocorreu um erro interno no servidor";
                    errorResponse.Detalhes = "Entre em contato com o suporte técnico";
                    break;
            }

            var jsonResponse = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await response.WriteAsync(jsonResponse);
        }
    }
}
