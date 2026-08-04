# ST-S01 — System Trading Pilot

Status: `in_progress`

## Objetivo

Validar o System Builder como plataforma capaz de registrar um workspace externo, instalar uma capability, vincular repositório/ambiente e comprovar leitura posterior sem acoplar o core ao domínio de trading.

## Resultado de produto

System Trading existe como tenant/adaptação do System Builder, com workspace, capability Trading Lab e metadados de ambiente/repositório visíveis por contratos da plataforma.

## Escopo incluído

- registro do workspace System Trading;
- instalação da capability Trading Lab;
- associação de repositório e ambiente;
- leitura e visibilidade dos registros;
- testes de correspondência e erro;
- closeout do piloto.

## Fora de escopo

- implementar estratégias, backtest ou execução de ordens;
- alterar o System Trading durante fases exclusivas de hardening do System Builder;
- colocar regras de trading dentro do core universal.

## Dependências

- registry e workspace atuais;
- isolamento de fases entre `src/**` e `system-building/**`;
- contratos de capability e metadata.

## Definição de pronto

O catálogo completo da sprint é reconciliado, todos os IDs possuem evidência e um closeout demonstra workspace, capability, repositório e ambiente por uma jornada reproduzível.
