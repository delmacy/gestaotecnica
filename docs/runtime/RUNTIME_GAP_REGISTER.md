# Runtime Gap Register

## Auditoria Explícita de Drift e Gaps
Lista catalogada comparando a ontologia canônica com o código atual do motor de runtime.

| ID | GAP | Status | Classificação AS-IS | Resolução Futura (Não executar nesta fase) |
|---|---|---|---|---|
| GAP-RC-001 | Drift entre Tipos e Schema: TS exporta `schemaVersion` mas o BD aceita `schema_version`. Sem alias no mapper. | Critical | `must_fix_before_runtime_execution` | RC-FIX-B |
| GAP-RC-002 | Uso explícito do tipo genérico `any` para payloads em DTOs ao longo de `runtime.validation.ts` e `runtime.types.ts`. | High | `must_fix_before_runtime_execution` | RC-FIX-A |
| GAP-RC-003 | Casts `as any` abundantes escondem erros de banco nas injeções db para methods. | High | `must_fix_before_event_receipts` | RC-FIX-A |
| GAP-RC-004 | Ausência lógica da relação direta `processDefinitionId` em `ProcessInstanceRecord` do DB. | Low | `informational` | Decisão: manter ausente. Apenas buscar via query derivativa. |
| GAP-RC-005 | Ausência de verificação de `workspaceId` da ProcessVersion ao carregá-la durante instanciamento ou fetch path-finding. | Critical | `must_fix_before_runtime_execution` | RC-FIX-C |
| GAP-RC-006 | Atualização faltante no `currentStateId` do instance no banco não é alimentada pela engine linear de hoje nos advances. | High | `must_fix_before_event_receipts` | RC-FIX-E |
| GAP-RC-007 | Criação da primeira action execution sendo marcada como status fixo, e assumindo payloads limpos sem mapper lógico do initialPayload. | Medium | `may_fix_after_contracts` | RC-FIX-E |
| GAP-RC-008 | Path Finding linear frágil. Pega sempre a `outgoingEdges[0]`. Inseguro em processos de negócio reais, não aceita branches conditionais. | High | `must_fix_before_runtime_execution` | RC-FIX-F |
| GAP-RC-009 | Gravações não-transacionais em massa, dividindo inserts lógicos sem tx wrapper no db layer. | Critical | `must_fix_before_event_receipts` | RC-FIX-D |
| GAP-RC-010 | Idempotência e chaves duplicadas inexistentes. Permite race conditions que gravam nodes clonados. | Medium | `future` | RC-FIX-G |
| GAP-RC-011 | Duplicate command e Duplicate event vulneráveis sem chaves de atomicidade na logica do server action. | Medium | `future` | RC-FIX-G |
| GAP-RC-012 | Atomicity de events e outbox sem garantia de transação SQL na emissão de log/outbox. | High | `must_fix_before_event_receipts` | RC-FIX-D, RC-FIX-H |
| GAP-RC-013 | Default ActionExecution com string genérica, não garante uso correto do Lifecycle (pending -> running -> completed). | Medium | `must_fix_before_runtime_execution` | RC-FIX-F |
| GAP-RC-014 | Mapeamento incorreto de Data (Timestamps e Datas em Types) recebidos vs Banco. | Medium | `must_fix_before_event_receipts` | RC-FIX-A |
| GAP-RC-015 | Tratamento genérico `INTERNAL_ERROR` sem dar reason code mapeado do Zod ou DB Error. | Medium | `may_fix_after_contracts` | RC-FIX-I |
| GAP-RC-016 | Actor validation (RBAC) ou tokenização não presente no runtime engine atual. Server bounder assume tenant mockado. | Critical | `must_fix_before_runtime_execution` | RC-FIX-C |
| GAP-RC-017 | Adaptação perigosa (Definitive Compatibility) lendo `definition.draft.nodes` do banco que devia estar formatado para runtime seguro. | High | `must_fix_before_runtime_execution` | RC-FIX-E |
| GAP-RC-018 | Ausência de testes de integração acoplados ao DB com isolamento testcontainer. | Medium | `future` | RC-FIX-I |

Estes GAPs comprovam que o runtime de early phase não está pronto para o lançamento da Fase 2 (execução real). O Grupo D permanecerá bloqueado.
