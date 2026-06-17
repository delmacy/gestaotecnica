# PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001_REPORT

## Identificação
- **Package ID**: PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001
- **Module**: platform-errors
- **Relator**: Jules (Architecture Inventory Worker)
- **Data**: 2024-06-17

## Resumo Analítico
Foi realizada uma varredura completa no repositório `gestaotecnica` para identificar o uso atual e as necessidades de migração para o padrão `PlatformError`.

### Estatísticas de Consumidores
- **Total de Ocorrências Analisadas**: ~379
- **Consumidores Únicos Identificados (Deduplicados)**: 124

#### Distribuição por Classificação (Boundary)
- **Application**: 33
- **Server Action**: 24
- **Domain**: 22
- **Logging**: 16
- **Background Job**: 11
- **API**: 9
- **Action Runner**: 4
- **UI**: 3
- **Workflow Engine**: 2

#### Distribuição por Status de Adoção
- **CANONICAL**: 3 (Core do módulo platform-errors)
- **SAFE_BUT_LEGACY**: 8 (Usam Error mas estão na camada de plataforma)
- **PARTIAL**: 88 (Adoção incompleta ou uso de Error padrão)
- **UNSAFE**: 25 (Vazamento de detalhes, logs diretos de erro unknown)

## Maiores Riscos Identificados
1. **Vazamento de Stack Traces**: Identificado em `src/platform/actions/action-runner.ts` onde o erro bruto é passado para o campo `details`.
2. **Segredos em Logs**: Uso extensivo de `console.error(error)` em APIs e infraestrutura de banco de dados, sem redacting de campos sensíveis.
3. **Inconsistência de Contratos**: APIs retornam estruturas de erro heterogêneas, dificultando o tratamento uniforme no frontend.
4. **Perda de Contexto**: Uso predominante de `throw new Error(string)`, o que remove informações de severidade, categoria e IDs de correlação.

## Sequência Recomendada de Migração
1. **Blindagem da Borda (API)**: Implementar `sanitizeUnknownError` em todos os roteadores de API e Gateways.
2. **Padronização de Executores**: Migrar `ActionRunner` e `FlowRunner` para produzir `PlatformErrorEnvelope`.
3. **Refatoração de Server Actions**: Substituir lançamentos de `Error` genérico por chamadas ao `createPlatformError` nas ações de módulo.
4. **Consolidação de Observabilidade**: Centralizar logs através do `PlatformError` para garantir auditoria determinística.

## Conclusão
O sistema possui uma base sólida para tratamento de erros, mas a adoção do padrão canônico está concentrada no core. A migração das camadas de aplicação e API é crítica para garantir a segurança e a rastreabilidade exigidas pela arquitetura.
