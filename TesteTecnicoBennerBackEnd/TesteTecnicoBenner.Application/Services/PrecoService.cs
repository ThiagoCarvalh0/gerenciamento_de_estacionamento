using TesteTecnicoBenner.Domain.Models;
using TesteTecnicoBenner.Domain.Interfaces;
using TesteTecnicoBenner.Application.DTOs;

namespace TesteTecnicoBenner.Application.Services
{
    public class PrecoService
    {
        private readonly IPrecoRepository _precoRepository;

        public PrecoService(IPrecoRepository precoRepository)
        {
            _precoRepository = precoRepository;
        }

        public async Task<PaginacaoDto<PrecoDto>> ListarPaginadoAsync(FiltroPaginacaoDto filtro)
        {
            var (precos, total) = await _precoRepository.ListarPaginadoAsync(
                filtro.Page, 
                filtro.Limit, 
                filtro.OrderBy, 
                filtro.Order
            );

            var totalPages = (int)Math.Ceiling((double)total / filtro.Limit);

            return new PaginacaoDto<PrecoDto>
            {
                Data = precos.Select(MapToDto).ToList(),
                Total = total,
                Page = filtro.Page,
                Limit = filtro.Limit,
                TotalPages = totalPages
            };
        }

        public async Task<List<PrecoDto>> ListarTodosAsync()
        {
            var precos = await _precoRepository.ListarTodosAsync();
            return precos.Select(MapToDto).ToList();
        }

        public async Task<List<PrecoDto>> ListarTodosAtivosAsync()
        {
            var precos = await _precoRepository.ListarTodosAsync();
            return precos.Select(MapToDto).ToList();
        }

        public async Task<List<PrecoDto>> ListarVigentesAsync()
        {
            var precos = await _precoRepository.ListarVigentesAsync();
            return precos.Select(MapToDto).ToList();
        }

        public async Task<List<PrecoDto>> ListarRecentesAsync(int dias = 30)
        {
            var precos = await _precoRepository.ListarRecentesAsync(dias);
            return precos.Select(MapToDto).ToList();
        }

        public async Task<PrecoDto?> ObterPorIdAsync(int id)
        {
            var preco = await _precoRepository.ObterPorIdAsync(id);
            return preco != null ? MapToDto(preco) : null;
        }

        public async Task<PrecoDto> CriarAsync(CriarPrecoDto dto)
        {
            var preco = new Preco
            {
                VigenciaInicio = dto.VigenciaInicio,
                VigenciaFim = dto.VigenciaFim,
                ValorHoraInicial = dto.ValorHoraInicial,
                ValorHoraAdicional = dto.ValorHoraAdicional
            };

            await _precoRepository.AdicionarAsync(preco);
            await _precoRepository.SalvarAsync();

            return MapToDto(preco);
        }

        public async Task<PrecoDto?> AtualizarAsync(int id, AtualizarPrecoDto dto)
        {
            var preco = await _precoRepository.ObterPorIdAsync(id);
            if (preco == null) return null;

            // Atualizar apenas campos fornecidos
            if (dto.VigenciaInicio.HasValue)
                preco.VigenciaInicio = dto.VigenciaInicio.Value;
            
            if (dto.VigenciaFim.HasValue)
                preco.VigenciaFim = dto.VigenciaFim.Value;
            
            if (dto.ValorHoraInicial.HasValue)
                preco.ValorHoraInicial = dto.ValorHoraInicial.Value;
            
            if (dto.ValorHoraAdicional.HasValue)
                preco.ValorHoraAdicional = dto.ValorHoraAdicional.Value;

            await _precoRepository.AtualizarAsync(preco);
            await _precoRepository.SalvarAsync();

            return MapToDto(preco);
        }

        public async Task<bool> ExcluirAsync(int id)
        {
            var existe = await _precoRepository.ExisteAsync(id);
            if (!existe) return false;

            await _precoRepository.ExcluirAsync(id);
            await _precoRepository.SalvarAsync();
            return true;
        }

        private static PrecoDto MapToDto(Preco preco)
        {
            var agora = DateTime.Now; // Usar horário local em vez de UTC
            var vigente = preco.VigenciaInicio <= agora && preco.VigenciaFim >= agora;
            
            return new PrecoDto
            {
                Id = preco.Id,
                VigenciaInicio = preco.VigenciaInicio,
                VigenciaFim = preco.VigenciaFim,
                ValorHoraInicial = preco.ValorHoraInicial,
                ValorHoraAdicional = preco.ValorHoraAdicional,
                Vigente = vigente, // Calculado dinamicamente baseado na vigência
                DataCriacao = preco.DataCriacao,
                DataAtualizacao = preco.DataAtualizacao
            };
        }
    }
}

