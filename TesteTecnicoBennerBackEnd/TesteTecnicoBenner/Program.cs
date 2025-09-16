using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using TesteTecnicoBenner.Infrastructure.Data;
using TesteTecnicoBenner.Infrastructure.Repositories;
using TesteTecnicoBenner.Domain.Interfaces;
using TesteTecnicoBenner.Application.Services;
using TesteTecnicoBenner.Application.Interfaces;
using TesteTecnicoBenner.Helpers;
using TesteTecnicoBenner.Middleware;

var builder = WebApplication.CreateBuilder(args);

// Registrar repositórios
builder.Services.AddScoped<IVeiculoRepository, VeiculoRepository>();
builder.Services.AddScoped<IPrecoRepository, PrecoRepository>();

// Registrar serviços
builder.Services.AddScoped<CalculoPrecoService>();
builder.Services.AddScoped<PrecoService>();
builder.Services.AddScoped<IApiResponseService, ApiResponseService>();
builder.Services.AddScoped<ApiResponseHelper>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TesteTecnicoBenner", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

builder.Services.AddDbContext<EstacionamentoContext>(options =>
    options.UseSqlite("Data Source=estacionamento.db"));

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TesteTecnicoBenner v1");
});

app.UseCors("AllowAll");

// Middleware global de tratamento de erros
app.UseMiddleware<GlobalErrorHandlingMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();