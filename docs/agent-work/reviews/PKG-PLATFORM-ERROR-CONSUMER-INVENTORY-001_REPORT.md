# PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001_REPORT

## Identificação
- **Package ID**: PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001
- **Module**: platform-errors
- **Relator**: Jules (Architecture Inventory Worker)
- **Data**: 2024-06-17

## Resumo Analítico
Foi realizada uma varredura completa no repositório `gestaotecnica` para identificar o uso atual e as necessidades de migração para o padrão `PlatformError`. Toda evidência foi validada para garantir a presença de símbolos/funções concretos (funções, métodos, handlers de rota).

### Estatísticas de Consumidores (Recalculadas)
- **Método de contagem**: 1 consumidor = 1 símbolo/função/route boundary concreto.
- **Consumidores Únicos Confirmados**: 155

#### Distribuição por Classificação (Boundary)
- **Server Action**: 78
- **Domain**: 19
- **Application**: 19
- **Background Job**: 16
- **Logging**: 9
- **API**: 9
- **UI**: 2
- **Action Runner**: 2
- **Workflow Engine**: 1

#### Distribuição por Status de Adoção
- **CANONICAL**: 3
- **SAFE_BUT_LEGACY**: 8
- **PARTIAL**: 118
- **UNSAFE**: 26

## Riscos de Exposição e Vazamento
- **Server Log Exposure (Stack Traces)**: Confirmado em `src/app/api/agent/route.ts` (POST) e `src/platform/registry/infra/registry.queries.ts`, onde `console.error` despeja a stack no log do servidor.
- **Client Response Exposure**: Risco em `src/platform/actions/action-runner.ts` (função `runAction`) ao retornar `details: error` diretamente no payload.
- **Persistence Exposure**: Identificado em `src/platform/events/event-log-service.ts` (função `appendEvent`).

## Recomendações
1. **Sanitização Imediata**: Aplicar `sanitizeUnknownError` nos handlers de API e no Action Runner.
2. **Normalização de Símbolos**: Migrar as 78 server actions identificadas para o uso de `createPlatformError`.
3. **Serialização Seletiva**: Utilizar serialização determinística apenas para contratos imutáveis, mantendo `NextResponse.json` para tráfego HTTP comum.

## Conclusão
O inventário foi consolidado para remover duplicatas por variável local e focar em limites arquiteturais (funções e handlers). Cada uma das 155 entradas foi verificada quanto ao seu símbolo de origem.
