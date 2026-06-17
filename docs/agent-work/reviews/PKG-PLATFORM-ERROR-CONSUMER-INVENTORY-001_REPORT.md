# PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001_REPORT

## Identificação
- **Package ID**: PKG-PLATFORM-ERROR-CONSUMER-INVENTORY-001
- **Module**: platform-errors
- **Relator**: Jules (Architecture Inventory Worker)
- **Data**: 2024-06-17

## Resumo Analítico
Foi realizada uma varredura completa no repositório `gestaotecnica` para identificar o uso atual e as necessidades de migração para o padrão `PlatformError`. Toda evidência foi validada para garantir a presença de símbolos/funções concretos.

### Estatísticas de Consumidores (Recalculadas)
- **Método de contagem**: 1 consumidor = 1 símbolo/função/route boundary concreto.
- **Consumidores Únicos Confirmados**: 194

#### Distribuição por Classificação (Boundary)
- **Server Action**: 62
- **Domain**: 37
- **Background Job**: 35
- **Application**: 25
- **Logging**: 17
- **API**: 12
- **UI**: 3
- **Action Runner**: 2
- **Workflow Engine**: 1

#### Distribuição por Status de Adoção
- **CANONICAL**: 3
- **SAFE_BUT_LEGACY**: 8
- **PARTIAL**: 144
- **UNSAFE**: 39

## Riscos de Exposição e Vazamento
- **Server Log Exposure (Stack Traces)**: Confirmado em `src/app/api/agent/route.ts` (handler POST) e executores de flows, onde `console.error` despeja o objeto de erro bruto no stdout do servidor.
- **Client Response Exposure**: Risco identificado em `src/platform/actions/action-runner.ts` (função `runAction`) ao retornar `details: error` diretamente no payload de resposta.
- **Persistence Exposure**: Identificado em `src/platform/events/event-log-service.ts` onde metadados técnicos podem ser salvos no banco de dados sem sanitização.

## Recomendações
1. **Sanitização Imediata**: Aplicar `sanitizeUnknownError` nos pontos de saída de API e no Action Runner.
2. **Normalização de Símbolos**: Migrar as 62 server actions identificadas para o uso de `createPlatformError` para preservar códigos de erro.
3. **Serialização Seletiva**: Utilizar serialização determinística apenas para contratos imutáveis ou assinados, mantendo `NextResponse.json` para o tráfego HTTP comum.

## Conclusão
A correção de qualidade de evidência aumentou a visibilidade de consumidores granulares (de 124 para 194). Todo registro no inventário agora aponta para um símbolo ou função verificável, eliminando entradas genéricas.
