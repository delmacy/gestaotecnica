# Runtime Future Implementation Plan

Este documento detalha as futuras tasks necessárias para transformar a fundação rascunho do Motor de Runtime no Contrato Canônico auditado nesta fase.
Estas implementações só podem ocorrer em Sprints futuras.

## Lote RC-FIX-A — Types and validators
- **objective**: Abolir o tipo genérico `any` dos domínios do runtime para payloads de Instance e Action. Transição para `unknown` associada a uma interface de Parse baseada em `schemaVersion`. Mapear timestamps reais.
- **dependencies**: Nenhuma.
- **allowed files**: `runtime.types.ts`, `runtime.validation.ts`
- **forbidden files**: Arquivos de UI, Services.
- **acceptance criteria**: Zod schemas de payload usam `z.record(z.string(), z.unknown())` ou algo inferível. Types TypeScript são limpos e sem any.
- **risk**: Baixo.
- **recommended order**: 1

## Lote RC-FIX-B — Schema row mappers
- **objective**: Corrigir o descasamento de nomenclatura TS (`schemaVersion`) para Postgres (`schema_version`), bem como eventuais type casts inseguros `as any` no Repositório.
- **dependencies**: RC-FIX-A.
- **allowed files**: `runtime.repository.ts`, `workflow.ts` (schema only, no migration se alias ts for suficiente)
- **forbidden files**: Services.
- **acceptance criteria**: O Drizzle select mapping usa aliasing e os records extraídos condizem 1:1 sem warnings no build.
- **risk**: Baixo.
- **recommended order**: 2

## Lote RC-FIX-C — Workspace isolation
- **objective**: Forçar o isolamento de tenant em queries limítrofes, como ao buscar o `ProcessVersion` para ler o diagrama. Acessos via API devem passar o Tenant real autenticado, não um string hardcoded de Server Actions.
- **dependencies**: Nenhuma.
- **allowed files**: `runtime-step.service.ts`, `runtime.server.ts`
- **forbidden files**: Repositories e Schema
- **acceptance criteria**: Se Request não envia workspace da sessão logada de fato, o comando aborta. Queries de versão testam o `workspaceId`.
- **risk**: Alto. Pode quebrar execuções antigas de UI no builder se o mock frontend não for ajustado.
- **recommended order**: 3

## Lote RC-FIX-D — Transaction boundaries
- **objective**: Envolver os multi-inserts do Engine (`process_instances`, `action_executions`, `event_logs`) numa transação segura do Drizzle.
- **dependencies**: Nenhuma (mas ideal RC-FIX-H junto).
- **allowed files**: `runtime.service.ts`, `runtime-step.service.ts`, `runtime.repository.ts`
- **forbidden files**: Arquivos de Schema/Database migrations.
- **acceptance criteria**: Uma falha proposital após a inserção da Action, mas antes do fechamento do request, causa ROLLBACK da Instance.
- **risk**: Médio. Alterar injeção de dependência do repositório para aceitar `tx`.
- **recommended order**: 4

## Lote RC-FIX-E — State initialization
- **objective**: Adaptar o adapter legível da versão (`definition.draft` no AS-IS) para uma leitura correta estrita canônica no momento em que cria instâncias e atualiza o `currentStateId`.
- **dependencies**: RC-FIX-F.
- **allowed files**: `runtime.service.ts`, `runtime-step.service.ts`
- **forbidden files**: Definition Schema.
- **acceptance criteria**: O `currentStateId` fica gravado na entidade `process_instances` e ponteia para a Action atual.
- **risk**: Médio.
- **recommended order**: 5

## Lote RC-FIX-F — Step advancement
- **objective**: Substituir a busca cega pela "primeira edge" em arrays no Path Finding para suportar Nodes de Condição e Múltiplos Edges.
- **dependencies**: Contrato canônico de expressões para branches (Futuro).
- **allowed files**: `runtime-step.service.ts`
- **forbidden files**: Schema.
- **acceptance criteria**: Avanço num fork deve avaliar condições lógicas.
- **risk**: Alto. Altera a fundação algorítmica do motor.
- **recommended order**: 6

## Lote RC-FIX-G — Idempotency and concurrency
- **objective**: Prevenir dupla escrita em requests paralelas (ex: dois cliques em Submit). Introduzir chaves no command context.
- **dependencies**: Lote RC-FIX-D.
- **allowed files**: `runtime.server.ts`, `runtime.actions.ts`
- **forbidden files**: N/A
- **acceptance criteria**: Comandos repetidos (mesmo ID ou Hash de idempotência) na mesma janela retornam 409 ou sucesso estático mudo.
- **risk**: Médio.
- **recommended order**: 7

## Lote RC-FIX-H — Events and outbox
- **objective**: Amarrar o log audit trail no ciclo atômico do BD, preenchendo a outbox table para broadcast futuro (n8n/webhooks).
- **dependencies**: Fase atual de Events.
- **allowed files**: Todo escopo de workflow/events e workflow/outbox.
- **forbidden files**: Definition layer.
- **acceptance criteria**: Atomicity 100% garantida entre a progressão do business status e o evento audível gerado.
- **risk**: Alto.
- **recommended order**: 8

## Lote RC-FIX-I — Runtime tests
- **objective**: Escrever Unit Tests blindados para as services de Runtime.
- **dependencies**: Todas as anteriores.
- **allowed files**: `tests/`
- **forbidden files**: `src/`
- **acceptance criteria**: Cobertura de transações, validação de inputs e erros canônicos com DB stub ou TestContainers.
- **risk**: Baixo.
- **recommended order**: 9
