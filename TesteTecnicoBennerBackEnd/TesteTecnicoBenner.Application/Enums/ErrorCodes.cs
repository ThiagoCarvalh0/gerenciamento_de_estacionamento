namespace TesteTecnicoBenner.Application.Enums
{
    public static class ErrorCodes
    {
        // Erros de Veículos
        public const string VEICULO_NAO_ENCONTRADO = "VEICULO_NAO_ENCONTRADO";
        public const string VEICULO_JA_ESTACIONADO = "VEICULO_JA_ESTACIONADO";
        public const string VEICULO_JA_SAIU = "VEICULO_JA_SAIU";
        public const string ERRO_ENTRADA_VEICULO = "ERRO_ENTRADA_VEICULO";
        public const string ERRO_SAIDA_VEICULO = "ERRO_SAIDA_VEICULO";

        // Erros de Preços
        public const string PRECO_NAO_ENCONTRADO = "PRECO_NAO_ENCONTRADO";
        public const string PRECO_NAO_VIGENTE = "PRECO_NAO_VIGENTE";
        public const string PRECO_INVALIDO = "PRECO_INVALIDO";
        public const string VIGENCIA_INVALIDA = "VIGENCIA_INVALIDA";

        // Erros de Validação
        public const string VALIDACAO_FALHOU = "VALIDACAO_FALHOU";
        public const string DADOS_INVALIDOS = "DADOS_INVALIDOS";
        public const string PLACA_INVALIDA = "PLACA_INVALIDA";
        public const string VALORES_INVALIDOS = "VALORES_INVALIDOS";

        // Erros de Sistema
        public const string ERRO_INTERNO = "ERRO_INTERNO";
        public const string SERVICO_INDISPONIVEL = "SERVICO_INDISPONIVEL";
        public const string BANCO_DADOS_ERRO = "BANCO_DADOS_ERRO";

        // Erros de Autorização
        public const string NAO_AUTORIZADO = "NAO_AUTORIZADO";
        public const string ACESSO_NEGADO = "ACESSO_NEGADO";

        // Erros de Recurso
        public const string RECURSO_NAO_ENCONTRADO = "RECURSO_NAO_ENCONTRADO";
        public const string RECURSO_JA_EXISTE = "RECURSO_JA_EXISTE";
        public const string RECURSO_EM_USO = "RECURSO_EM_USO";
    }
}
