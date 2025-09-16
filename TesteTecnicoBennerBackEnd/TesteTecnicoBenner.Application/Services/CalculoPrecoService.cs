using TesteTecnicoBenner.Domain.Models;
using TesteTecnicoBenner.Domain.Interfaces;
using TesteTecnicoBenner.Application.DTOs;

namespace TesteTecnicoBenner.Application.Services
{
    public class CalculoPrecoService
    {
        private readonly IVeiculoRepository _veiculoRepository;
        private readonly IPrecoRepository _precoRepository;
        
        // Preços de emergência caso não haja tabela vigente
        private static readonly decimal PRECO_EMERGENCIA_HORA_INICIAL = 10.00m;
        private static readonly decimal PRECO_EMERGENCIA_HORA_ADICIONAL = 5.00m;

        public CalculoPrecoService(
            IVeiculoRepository veiculoRepository,
            IPrecoRepository precoRepository)
        {
            _veiculoRepository = veiculoRepository;
            _precoRepository = precoRepository;
        }

        public async Task RegistrarEntrada(string placa)
        {
            // Verificar se já existe um veículo ativo (sem saída) com esta placa
            var veiculoExistente = await _veiculoRepository.ObterPorPlacaSemSaidaAsync(placa);
            
            if (veiculoExistente != null)
            {
                throw new Exception($"Veículo com placa {placa} já está no estacionamento desde {veiculoExistente.Entrada:dd/MM/yyyy HH:mm}");
            }

            // Verificar se há preço vigente antes de permitir a entrada
            var precoVigente = await _precoRepository.ObterPrecoVigenteAsync(DateTime.Now);
            if (precoVigente == null)
            {
                throw new Exception("Não é possível registrar entrada: não há tabela de preços vigente no momento. Configure uma tabela de preços antes de permitir entradas.");
            }

            var veiculo = new Veiculo
            {
                Placa = placa,
                Entrada = DateTime.Now
            };
            await _veiculoRepository.AdicionarAsync(veiculo);
            await _veiculoRepository.SalvarAsync();
        }

        public async Task<decimal> RegistrarSaida(string placa)
        {
            var veiculo = await _veiculoRepository.ObterPorPlacaSemSaidaAsync(placa);

            if (veiculo == null) 
                throw new Exception("Veículo não encontrado ou já saiu");

            var preco = await _precoRepository.ObterPrecoVigenteAsync(veiculo.Entrada);

            // Se não há preço vigente, usar preço de emergência
            if (preco == null) 
            {
                preco = new Preco 
                { 
                    ValorHoraInicial = PRECO_EMERGENCIA_HORA_INICIAL,
                    ValorHoraAdicional = PRECO_EMERGENCIA_HORA_ADICIONAL
                };
            }

            var tempo = DateTime.Now - veiculo.Entrada;
            decimal valor = CalcularValorEstacionamento(tempo, preco);

            veiculo.Saida = DateTime.Now;
            veiculo.ValorCobrado = valor;
            await _veiculoRepository.AtualizarAsync(veiculo);
            await _veiculoRepository.SalvarAsync();

            return valor;
        }

        public async Task<List<Veiculo>> ObterTodosVeiculos()
        {
            return await _veiculoRepository.ListarTodosAsync();
        }

        public async Task<Veiculo?> ObterVeiculoPorPlaca(string placa)
        {
            return await _veiculoRepository.ObterPorPlacaSemSaidaAsync(placa);
        }

        public async Task<bool> VerificarPrecoVigente()
        {
            var precoVigente = await _precoRepository.ObterPrecoVigenteAsync(DateTime.Now);
            return precoVigente != null;
        }

        public async Task<Preco?> ObterPrecoVigenteAtual()
        {
            return await _precoRepository.ObterPrecoVigenteAsync(DateTime.Now);
        }

        public async Task<decimal> CalcularValorAtual(string placa)
        {
            var veiculo = await _veiculoRepository.ObterPorPlacaSemSaidaAsync(placa);

            if (veiculo == null)
                throw new Exception("Veículo não encontrado ou já saiu");

            var preco = await _precoRepository.ObterPrecoVigenteAsync(veiculo.Entrada);

            // Se não há preço vigente, usar preço de emergência
            if (preco == null)
            {
                preco = new Preco 
                { 
                    ValorHoraInicial = PRECO_EMERGENCIA_HORA_INICIAL,
                    ValorHoraAdicional = PRECO_EMERGENCIA_HORA_ADICIONAL
                };
            }

            var tempo = DateTime.Now - veiculo.Entrada;
            return CalcularValorEstacionamento(tempo, preco);
        }

        private static decimal CalcularValorEstacionamento(TimeSpan tempo, Preco preco)
        {
            var totalMinutes = (int)tempo.TotalMinutes;

            if (totalMinutes <= 30)
            {
                return preco.ValorHoraInicial / 2;
            }

            var valor = preco.ValorHoraInicial;
            
            var minutosExcedentes = totalMinutes - 60;
            
            if (minutosExcedentes > 0)
            {
                var horasAdicionais = (int)Math.Ceiling(minutosExcedentes / 70.0);
                valor += horasAdicionais * preco.ValorHoraAdicional;
            }

            return valor;
        }
    }
}
