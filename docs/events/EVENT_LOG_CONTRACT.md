# EVENT LOG CONTRACT

O Event Log é a fundação para event-sourcing ou timeline tracing de instâncias, persistido como fonte de verdade de todo evento de domínio que ocorre no System Builder.

## Requisitos Canônicos

1. **Append-Only / Imutabilidade:** Registros persistidos no event log não podem ser excluídos ou alterados de maneira destrutiva (NUNCA usar comandos HTTP `PUT`/`PATCH` não mitigados em endpoints que mapeiam para event stores reais ou fazer `UPDATE` direto).
2. **Ordenação:** Todo evento deve ter um campo imutável de `createdAt` usado para ordenação de timeline.
3. **Workspace Isolation:** O event log deve ser unicamente filtrável de forma forçosa por `workspaceId` garantindo tenancy.
4. **Correlation & Causation:**
   - Eventos dentro do mesmo log devem ser rastreáveis de volta ao seu comando de origem através de `correlationId`.
   - Eventos sucessivos de um mesmo encadeamento devem apontar para a causa direta usando `causationId`.
5. **Actor & Source:**
   - O `actor` (sistema, usuário, script externo) deve sempre estar presente no envelope.
   - A origem (`source`) do comando/sistema que despachou a ação.
6. **Payload Sanitizado:** O payload deve ser previamente sanitizado sem expor segredos transacionais para log puro.
7. **Tratamento de Duplicidade:** Eventos duplicados baseados em `{source, id}` (futuro) ou chaves sintéticas de business deduplication devem ser prevenidos de forma transacional no banco ao salvar no event log (evitando drift).
8. **Proibição de Atualização Destrutiva:** Qualquer necessidade de "ajuste" ou compensação requer a criação de um novo evento compensatório.
9. **Leituras Suportadas:**
   - Leitura de timeline (`getTimelineForInstance`).
   - Filtro por instance / aggregate.
   - Filtro por type.
10. **Necessidades Futuras Identificadas:**
   - Implementação de numeração de sequência isolada (`sequence`) por `aggregate/instance` para strict lock.
   - Estrutura de schema evolution mapeada por `schemaVersion`.
   - Política de retenção programada baseada em expiração de tenant (retention lifecycle policy).
   - Paginação baseada em cursor para logs extensos.

## Auditoria do Schema Atual (Gap de Requisitos)

- `workflow.events` **tem** `createdAt` (preenche requisito 2).
- `workflow.events` **tem** `workspaceId` (preenche requisito 3).
- `workflow.events` **suporta** correlação via `correlationId` (preenche requisito 4 - opcional no momento).
- `workflow.events` **não tem** strict event schema version / evolution map (falha requisito 10).
- O DB atual permite `UPDATE` (falha na garantia hard requirement 1, dependendo apenas do repositório ser append-only hoje).
- O Payload não passa por policy estrita sanitária (falha requisito 6).
- Não há sequence locking (falha em optimistic concurrency - requisito 10).
- Retenção ou limitação não existem (falha requisito 10).
