# PLATFORM_ERROR_ADOPTION_PLAN

## 1. Onde PlatformError já é usado?
Atualmente, o `PlatformErrorEnvelope` e suas ferramentas de suporte (`createPlatformError`, `sanitizeUnknownError`) estão definidos no núcleo do sistema em `src/platform/errors/`.
A adoção formal ainda é limitada:
- **Definição e Contratos**: `src/platform/errors/schema.ts` e `src/platform/errors/factory.ts`.
- **Sanitização**: `src/platform/errors/sanitizer.ts`.
- **Testes Unitários**: `tests/unit/platform-error-*`.

## 2. Onde unknown é convertido diretamente em string?
Ocorre em diversos blocos `catch` que tentam extrair uma mensagem para retorno ou log sem usar o sanitizer canônico:
- `src/platform/actions/action-runner.ts`: `message: error instanceof Error ? error.message : "Falha ao executar action."`
- `src/platform/flows/flow-runner.ts`: Usa `console.error` e extrai mensagens simples.
- `src/app/api/agent/route.ts`: Converte erro capturado em uma resposta JSON genérica com mensagem fixa.

## 3. Onde stack pode escapar?
O risco de vazamento de `stack` existe onde o objeto de erro original é passado diretamente para o campo `details` ou para logs externos:
- `src/platform/actions/action-runner.ts`: Atribui `details: error` no retorno de `runAction`.
- `src/app/api/agent/route.ts`: `console.error("Agent Gateway Submission Error:", error)` pode imprimir a stack no log do servidor.

## 4. Onde erros são enviados ao cliente?
- **API Routes**: `src/app/api/**/*` usa `NextResponse.json` para retornar objetos de erro.
- **Server Actions**: `src/modules/*/actions.ts` lançam `Error` que o Next.js captura ou retornam `ActionResult` com erro.
- **UI Components**: Componentes como `src/features/builder/canvas/BuilderCanvas.tsx` capturam erros de renderização/lógica.

## 5. Onde detalhes técnicos são persistidos?
- **Logs de Console**: Presentes em quase todos os arquivos de infraestrutura (`src/platform/registry/infra`, `src/platform/blueprints/infra`).
- **Event Logs**: `src/platform/events/event-log-service.ts` pode persistir payloads de erro sem sanitização prévia.

## 6. Onde há perda de category/code/status?
Quase todos os consumidores atuais fora do pacote `platform-errors` perdem metadados estruturados:
- `src/modules/*/actions.ts`: As server actions costumam lançar `new Error(message)` básico, descartando códigos de erro específicos do domínio.
- `src/platform/actions/action-runner.ts`: Mapeia tudo para `ACTION_FAILED` independente da causa raiz.

## 7. Onde o sanitizer deve entrar?
O `sanitizeUnknownError` deve ser injetado em:
- Todos os blocos `catch` de **API Routes**.
- Todos os blocos `catch` de **Server Actions**.
- O `action-runner.ts` e o `flow-runner.ts` para garantir que `details` não contenha segredos ou stacks.

## 8. Onde a serialização determinística deve entrar?
- Respostas de API (`NextResponse`).
- Persistência em tabelas de auditoria e `event_logs`.
- Comunicação entre o Worker de background e a API principal.

## 9. Quais pontos não devem usar serialização?
- Scripts de build e manutenção local (`src/scripts/*`).
- Logs de depuração em ambiente de desenvolvimento.
- Testes unitários internos que verificam a estrutura bruta do erro.

## 10. Qual a sequência de migração mais segura?
1. **Core Platform**: Migrar `action-runner.ts` e `flow-runner.ts` para retornar `PlatformErrorEnvelope`.
2. **API Gateways**: Atualizar `src/app/api/agent/route.ts` e similares para usar o sanitizer.
3. **Application Layer**: Padronizar o retorno das Server Actions em `src/modules/`.
4. **Observability**: Integrar o `PlatformError` com o serviço de logs centralizado.

## Propostas de Pacotes Futuros

- **PKG-PLATFORM-ERROR-HTTP-MAPPING-001**: Utilitários para converter `PlatformErrorEnvelope` em `NextResponse` com status HTTP correto.
- **PKG-PLATFORM-ERROR-LOGGING-ADAPTER-001**: Adapter para o logger canônico que aceita envelopes de erro.
- **PKG-PLATFORM-ERROR-WEBHOOK-ADAPTER-001**: Normalização de erros para disparos de webhooks de saída.
