# SB-S02-T09 — Revisão de isolamento e append-only

## Escopo
Auditoria independente da implementação integrada das tasks T07 e T08, com foco em:

- queries tenant-aware;
- constraints de idempotência;
- existência de operações `UPDATE`/`DELETE` sobre o histórico;
- risco de vazamento cross-tenant;
- proteção append-only em nível de aplicação e banco.

Base auditada: `main` após o merge da PR #365, commit `f40086c5ad08c1ea4fd684f34b3ea46dff9cd207`.

## Resultado executivo

**Status: REPROVADO COM BLOQUEIOS ESTRUTURAIS**

A camada operacional central (`EventWriter`) está corretamente orientada a `INSERT` e todas as queries públicas auditadas filtram por `workspace_id`. Porém, os critérios da T09 não podem ser considerados integralmente atendidos porque a tabela `workflow.events` ainda não possui proteção estrutural de banco contra `UPDATE`/`DELETE` e não possui Row-Level Security para impedir leituras cross-tenant por acessos diretos ao banco ou por novas queries fora do `EventWriter`.

## Achados

### T09-F01 — Queries públicas do EventWriter são tenant-aware
**Severidade:** nenhuma pendência.

As consultas auditadas aplicam filtro explícito pelo workspace do contexto:

- `getBatch`: `workspace_id = context.workspaceId` e `batchId`;
- `getEntityHistory`: `workspace_id = context.workspaceId`, `entityType` e `entityId`;
- `getWorkspaceEventStream`: `workspace_id = context.workspaceId`.

Não foi encontrada query pública do `EventWriter` que retorne histórico sem filtro de workspace.

**Resultado:** aprovado na camada de aplicação.

### T09-F02 — Escrita deriva workspace e actor do contexto
**Severidade:** nenhuma pendência.

`prepareEvent` substitui valores fornecidos no evento por:

- `workspaceId: context.workspaceId`;
- `actorId: context.actor.id || "system"`.

A persistência utiliza o evento canônico preparado e não usa workspace recebido no payload.

**Resultado:** aprovado.

### T09-F03 — Idempotência isolada por workspace
**Severidade:** nenhuma pendência.

A tabela possui índice único parcial em:

`(workspace_id, idempotency_key) WHERE idempotency_key IS NOT NULL`

O `INSERT` usa o mesmo alvo de conflito. Assim, a mesma chave pode existir em workspaces distintos e não pode gerar duplicidade dentro do mesmo workspace.

**Resultado:** aprovado.

### T09-F04 — Nenhum UPDATE/DELETE operacional no EventWriter
**Severidade:** nenhuma pendência na camada auditada.

O fluxo central de eventos utiliza:

- `INSERT` para gravação;
- `SELECT` para leitura;
- `ON CONFLICT DO NOTHING` para idempotência.

Não há métodos operacionais de edição ou exclusão no `EventWriter`.

A ocorrência de limpeza encontrada em script E2E é utilitária de ambiente de teste e não integra o fluxo operacional.

**Resultado:** aprovado na aplicação.

### T09-F05 — Ausência de proteção append-only no banco
**Severidade:** alta — bloqueio de aceite.

A tabela `workflow.events` não possui trigger, regra, política ou revogação de privilégios que impeça diretamente:

- `UPDATE workflow.events ...`;
- `DELETE FROM workflow.events ...`.

Consequentemente, qualquer código com acesso de escrita à conexão runtime pode alterar ou apagar histórico sem passar pelo `EventWriter`.

O critério “nenhum update/delete operacional” está atendido apenas por convenção de código, não por invariável técnica.

**Correção exigida:** criar proteção append-only em nível de PostgreSQL, preferencialmente por trigger `BEFORE UPDATE OR DELETE` que execute `RAISE EXCEPTION`, com exceção apenas para rotinas administrativas explicitamente separadas, se realmente necessárias.

### T09-F06 — Ausência de RLS ou barreira equivalente contra cross-tenant
**Severidade:** alta — bloqueio de aceite.

As queries existentes filtram corretamente por `workspace_id`, mas a tabela não possui Row-Level Security nem outra barreira de banco vinculada ao workspace corrente.

Isso permite que:

- uma nova query futura omita o filtro;
- um módulo use `getRuntimeDb()` diretamente;
- SQL manual consulte eventos de todos os tenants.

Portanto, “nenhum histórico cross-tenant” depende exclusivamente da disciplina de implementação atual.

**Correção exigida:** implementar uma barreira de banco compatível com a arquitetura multi-tenant. Opções aceitáveis:

1. RLS em `workflow.events` baseada em uma variável de sessão transacional, por exemplo `app.workspace_id`;
2. role de aplicação sem acesso direto à tabela e acesso somente por função segura tenant-aware;
3. mecanismo equivalente que seja testável e fail-closed.

### T09-F07 — Métodos de leitura não validam explicitamente contexto ausente
**Severidade:** média.

Os métodos de leitura usam `context.workspaceId`, mas não aplicam validação tipada equivalente à escrita. Um contexto ausente pode gerar erro genérico em vez de `MISSING_WORKSPACE_CONTEXT`.

Isso não produz vazamento por si só, porém enfraquece o contrato fail-closed e a consistência da API.

**Correção exigida:** centralizar validação do contexto e aplicá-la a todas as operações públicas de leitura e escrita.

### T09-F08 — `appendDomainEvents` continua oferecendo lote não atômico
**Severidade:** média.

Existe método público legado `appendDomainEvents` que processa eventos sequencialmente e documenta explicitamente que não é atômico. Após a introdução de `appendDomainEventBatch`, esse método pode ser usado por engano em fluxos que esperem atomicidade.

**Correção recomendada:** descontinuar, renomear para algo inequivocamente não atômico, restringir visibilidade ou migrar consumidores para `appendDomainEventBatch`.

## Matriz de aceite

| Critério | Resultado |
|---|---|
| Queries centrais filtram workspace | Aprovado |
| Idempotência isolada por workspace | Aprovado |
| Nenhum update/delete no EventWriter | Aprovado |
| Proteção append-only estrutural no banco | Reprovado |
| Nenhum histórico cross-tenant por barreira técnica | Reprovado |
| Contexto fail-closed em todas as leituras | Parcial |
| API de lote sem ambiguidade operacional | Parcial |

## Decisão

A T09 não pode ser aceita como concluída apenas com a auditoria. Os achados T09-F05 e T09-F06 são bloqueadores estruturais.

É necessária uma task corretiva na mesma T09 ou uma subtarefa explícita antes da T10 para:

1. impedir `UPDATE` e `DELETE` em `workflow.events` no PostgreSQL;
2. adicionar barreira de isolamento tenant em nível de banco;
3. adicionar testes negativos que provem bloqueio de mutação e leitura cross-tenant;
4. validar contexto de workspace em todas as APIs públicas de leitura;
5. tratar o método legado não atômico.

## Evidência requerida após correção

- tentativa de `UPDATE` falha no banco;
- tentativa de `DELETE` falha no banco;
- conexão/contexto de workspace A não consegue ler eventos de B;
- query sem workspace falha de forma fechada;
- testes existentes de T07 e T08 permanecem verdes;
- migrations aplicam e revertem de forma previsível;
- CI, typecheck e build aprovados.
