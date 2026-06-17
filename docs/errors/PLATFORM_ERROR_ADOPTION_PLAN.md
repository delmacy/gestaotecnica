# PLATFORM_ERROR_ADOPTION_PLAN

## 1. Onde PlatformError já é usado?
Atualmente, o `PlatformErrorEnvelope` e suas ferramentas de suporte (`createPlatformError`, `sanitizeUnknownError`) estão definidos no núcleo do sistema em `src/platform/errors/`.
A adoção formal ainda é limitada:
- **Definição e Contratos**: `src/platform/errors/schema.ts` e `src/platform/errors/factory.ts`.
- **Sanitização**: `src/platform/errors/sanitizer.ts`.
- **Testes Unitários**: `tests/unit/platform-error-*`.

## 2. Onde unknown é convertido diretamente em string?
Ocorre em diversos blocos `catch` que tentam extrair uma mensagem para retorno ou log sem usar o sanitizer canônico:
- `src/platform/actions/action-runner.ts`: Na função `runAction`, usa `error instanceof Error ? error.message : "Falha ao executar action."`
- `src/platform/flows/flow-runner.ts`: No método `execute`, captura erros e usa mensagens simples.
- `src/app/api/agent/route.ts`: No handler `POST`, converte erro capturado em uma resposta JSON genérica.

## 3. Onde stack pode escapar?
O risco de vazamento de `stack` deve ser analisado por fronteira:
- **Exposição em Logs de Servidor**: `console.error(error)` em `src/app/api/agent/route.ts` e diversos queries em `src/platform/*/infra/`. Imprime a stack completa no stdout/stderr do servidor.
- **Exposição em Resposta ao Cliente**: `src/platform/actions/action-runner.ts` retorna `details: error`. Se o erro for um objeto nativo, dependendo da serialização final, a stack pode vazar para o chamador.
- **Exposição em Persistência**: `src/platform/events/event-log-service.ts` pode persistir o objeto de erro sem filtro.

## 4. Onde erros são enviados ao cliente?
- **API Routes**: `src/app/api/**/*` via `NextResponse.json`. Ex: `src/app/api/agent/route.ts`.
- **Server Actions**: `src/modules/*/actions.ts` retornam objetos que chegam ao frontend. Ex: `createSchedule` em `src/modules/schedules/actions.ts`.
- **UI Components**: `src/features/builder/canvas/BuilderCanvas.tsx` trata erros de integração local.

## 5. Onde detalhes técnicos são persistidos?
- **Logs de Console**: Infraestrutura (`src/platform/registry/infra`, `src/platform/blueprints/infra`).
- **Event Logs**: `src/platform/events/event-log-service.ts` registra falhas de processamento.

## 6. Onde há perda de category/code/status?
- **Server Actions**: A maioria em `src/modules/` lança `new Error(message)` básico, perdendo a semântica do erro de negócio.
- **Action Runner**: O `runAction` em `src/platform/actions/action-runner.ts` encapsula erros originais em um código genérico `ACTION_FAILED`.

## 7. Onde o sanitizer deve entrar?
O `sanitizeUnknownError` deve ser injetado em:
- Blocos `catch` de **API Routes** antes do `NextResponse.json`.
- Blocos `catch` de **Server Actions** para normalizar o retorno.
- Middleware de tratamento de erro global, se existente.

## 8. Onde a serialização determinística deve entrar?
- Apenas onde contratos de transporte (ex: assinaturas, hashing de integridade) ou persistência estável (ex: `event_logs` imutáveis) exigirem payloads byte-stable.
- **Não** é recomendada para todas as respostas HTTP simples, onde o `NextResponse.json` padrão é suficiente.

## 9. Quais pontos não devem usar serialização?
- Scripts de manutenção local (`src/scripts/*`).
- Mensagens de log internas de depuração (debug level).
- Verificações de asserção em testes unitários.

## 10. Qual a sequência de migração mais segura?
1. **Blindagem da Borda (API)**: Adotar `sanitizeUnknownError` nos Gateways (ex: Agent Gateway).
2. **Normalização de Executores**: Ajustar `ActionRunner` para retornar `PlatformErrorEnvelope`.
3. **Refatoração de Camada de Aplicação**: Padronizar retornos de Server Actions em `src/modules/`.
4. **Governança de Logs**: Substituir `console.error` direto por logger sanitizado.

## Propostas de Pacotes Futuros

- **PKG-PLATFORM-ERROR-HTTP-MAPPING-001**: Mapeamento de `PlatformErrorEnvelope` para status HTTP e `NextResponse`.
- **PKG-PLATFORM-ERROR-LOGGING-ADAPTER-001**: Adapter para integração com sistemas de log (ex: console, sentry) usando envelopes.
- **PKG-PLATFORM-ERROR-WEBHOOK-ADAPTER-001**: Normalização de erros para disparo de webhooks externos.
