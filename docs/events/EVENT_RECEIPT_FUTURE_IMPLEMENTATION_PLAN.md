# EVENT RECEIPT FUTURE IMPLEMENTATION PLAN

Este plano detalha, em lotes sequenciais, as tarefas para as futuras sprints de engenharia (implementação de código) para atualizar o Runtime com o Contrato Canônico de Eventos e Recibos, sanando os 36 gaps estruturais encontrados. Nenhuma destas tarefas deve ser codificada no escopo da sprint atual (de design arquitetural).

## Lote ER-FIX-A — Canonical event types and validators

- **Objective:** Atualizar schemas Drizzle e tipos Zod (`events.validation.ts`) com novos campos de envelope e suportes de versionamento (`specVersion`, taxonomias `runtime.*`).
- **Dependencies:** Nenhuma.
- **Allowed files:** `src/features/workflow/runtime/events/events.types.ts`, `src/features/workflow/runtime/events/events.validation.ts`
- **Forbidden files:** Repositories e Services.
- **Schema change required:** Sim.
- **Acceptance criteria:** O Zod parseará apenas os taxonomias e campos canônicos. Types Typescript compilando.
- **Risk:** Baixo.
- **Recommended order:** 1

## Lote ER-FIX-B — Event row mappers

- **Objective:** Refatorar a query logic que insere / puxa Event Records, alterando tipagens dinâmicas `any` para schemas validados.
- **Dependencies:** ER-FIX-A.
- **Allowed files:** `src/features/workflow/runtime/events/events.repository.ts`
- **Forbidden files:** Runtime Services genéricos.
- **Schema change required:** Sim, remoção de casts no acesso ao PostgreSQL/Drizzle.
- **Acceptance criteria:** Inserções são Type Safe. Query builder rejeita payloads sem os campos requeridos.
- **Risk:** Médio.
- **Recommended order:** 2

## Lote ER-FIX-C — Event/outbox transaction boundary

- **Objective:** Consolidar e injetar unit-of-work (tx) nos services `startProcessInstance` e `advanceStep`, unificando a mutação e log de evento via `db.transaction()`.
- **Dependencies:** ER-FIX-B.
- **Allowed files:** `src/features/workflow/runtime/runtime.service.ts`, `src/features/workflow/runtime/runtime-step.service.ts`, `src/features/workflow/runtime/runtime.repository.ts`
- **Forbidden files:** Integrações externas.
- **Schema change required:** Não.
- **Acceptance criteria:** Erros na geração de Log/Outbox automaticamente revertem inserção da instância ou steps.
- **Risk:** Alto (Core Engine Refactor).
- **Recommended order:** 3

## Lote ER-FIX-D — Outbox status and retry model

- **Objective:** Modificar esquema do Outbox. Introduzir os novos status canônicos e campos temporais e de limite de erro.
- **Dependencies:** ER-FIX-C.
- **Allowed files:** `src/db/runtime/schema/workflow.ts`, migrations script.
- **Forbidden files:** UI e Workers.
- **Schema change required:** Sim.
- **Acceptance criteria:** Tabela suportando lock properties, maxAttempts, e nextAttemptAt.
- **Risk:** Alto (Migration Required).
- **Recommended order:** 4

## Lote ER-FIX-E — Dispatcher claim and concurrency

- **Objective:** Desenvolver o SQL Raw ou Drizzle function `SELECT FOR UPDATE SKIP LOCKED` para consumir OutboxEntries concorrentemente.
- **Dependencies:** ER-FIX-D.
- **Allowed files:** `src/features/workflow/runtime/events/outbox.repository.ts` (a ser criado).
- **Forbidden files:** N/A.
- **Schema change required:** Não.
- **Acceptance criteria:** Teste unitário prova que 2 processos não processam a mesma outbox message simultaneamente.
- **Risk:** Alto (Concurrency).
- **Recommended order:** 5

## Lote ER-FIX-F — Delivery attempt persistence

- **Objective:** Criar entidade e tabela `DeliveryAttempt` para o dispatch loop rastrear esforço técnico.
- **Dependencies:** ER-FIX-E.
- **Allowed files:** Schema db, migrations.
- **Forbidden files:** Workers externos.
- **Schema change required:** Sim.
- **Acceptance criteria:** Tracking imutável em DB.
- **Risk:** Médio.
- **Recommended order:** 6

## Lote ER-FIX-G — Delivery receipt persistence

- **Objective:** Criar entidade e tabela `DeliveryReceipt` com webhook / receiver end-point base (API).
- **Dependencies:** ER-FIX-F.
- **Allowed files:** Schema db, actions/server endpoints.
- **Forbidden files:** N/A.
- **Schema change required:** Sim.
- **Acceptance criteria:** Endpoints seguros permitindo append de receipt externo contra um outbox dispatch anterior.
- **Risk:** Alto (Exposes endpoint).
- **Recommended order:** 7

## Lote ER-FIX-H — Consumer inbox and deduplication

- **Objective:** Construção do Ingestion pipeline interno `ConsumerInbox` (com dedup key support).
- **Dependencies:** ER-FIX-G.
- **Allowed files:** Schema db, consumer controllers.
- **Forbidden files:** Gateway admin screens.
- **Schema change required:** Sim.
- **Acceptance criteria:** Worker consegue tolerar repetição massiva de um evento consumindo sem erro.
- **Risk:** Alto.
- **Recommended order:** 8

## Lote ER-FIX-I — Traceability receipt

- **Objective:** Construção do canhoto legal `TraceabilityReceipt`, gerando sumarização histórica em JSON/Document após `process.completed`.
- **Dependencies:** ER-FIX-C.
- **Allowed files:** Schema db, `traceability.service.ts`
- **Forbidden files:** N/A.
- **Schema change required:** Sim.
- **Acceptance criteria:** Canhoto montado com referências auditáveis preservando toda a cadeia da instância.
- **Risk:** Baixo.
- **Recommended order:** 9

## Lote ER-FIX-J — Security and redaction

- **Objective:** Implementação das restrições de string truncating e remoção de secret key nos payloads baseados nas ruleset do contrato de payload security.
- **Dependencies:** ER-FIX-B.
- **Allowed files:** Util/Sanitizer hooks no Event Repository.
- **Forbidden files:** N/A.
- **Schema change required:** Não.
- **Acceptance criteria:** Teste confirmando regex masking de CPF/Keys antes do insert db.
- **Risk:** Médio.
- **Recommended order:** 10

## Lote ER-FIX-K — Observability

- **Objective:** Adição de instrumentação estruturada (Pino/Winston metrics) nos checkpoints do dispatch.
- **Dependencies:** ER-FIX-A a ER-FIX-J.
- **Allowed files:** Server Loggers.
- **Forbidden files:** Schema/DB.
- **Schema change required:** Não.
- **Acceptance criteria:** Logs json output com tags e sem PII fields vazando no STDOUT.
- **Risk:** Baixo.
- **Recommended order:** 11

## Lote ER-FIX-L — Integration tests

- **Objective:** Criação de testes com container banco isolado simulando concorrência pesada, transaction rollback, drift control e deduplicação de Consumer/Dispatch.
- **Dependencies:** Todos anteriores.
- **Allowed files:** `tests/integration/**`
- **Forbidden files:** Runtime prod files.
- **Schema change required:** Não.
- **Acceptance criteria:** Cobertura crítica de reliability atestada.
- **Risk:** Baixo.
- **Recommended order:** 12
