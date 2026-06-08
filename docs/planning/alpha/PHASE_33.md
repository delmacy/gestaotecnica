# Feature Contract — Fase 33
## 1. Identificação
- Fase: 33
- Nome: Living Procedures Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 33B
- Status: Planejada refinada

## 2. Objetivo
Entidade `living_procedures` atrelada a uma versão de processo.

## 3. Problema que resolve
Associa documentação de procedimentos aos workflows (Process Versions).

## 4. Domínio / DDD
- Bounded Context: Platform / Builder Context
- Ubiquitous Language:
  - Living Procedure
  - Process Version Binding
- Aggregate/Entity principal: LivingProcedure
- Value Objects:
  - ProcedureStatus
- Invariantes:
  - Procedimento só pode ser 'published' se estiver vinculado a uma ProcessVersion com status 'published'.
- Domain/Application Events:
  - ProcedurePublished
- Application Use Case:
  - PublishLivingProcedure
  - CreateLivingProcedureDraft
- Anti-Corruption Layer:
  - N/A
- Repository Port:
  - LivingProcedureRepositoryPort
- Infrastructure Adapter:
  - DrizzleLivingProcedureRepository
- Transaction Boundary:
  - Validação de versão de processo + atualização de status do procedimento.
- Consistency/Idempotency:
  - N/A
- Workspace Scope:
  - Isolamento por workspace_id obrigatório.
- Audit/Trace:
  - Autoria (created_by_id, updated_by_id).

## 5. Escopo permitido
- Tabelas e Service de Living Procedures.

## 6. Fora de escopo
- Gerador IA de documentos.

## 7. Entidades e contratos
- Entidade: `living_procedures`
- Campos: `id`, `workspace_id`, `process_definition_id`, `process_version_id`, `title`, `body_markdown`, `status` (draft | published | archived), `created_by_id`, `updated_by_id`, `created_at`, `updated_at`.
- Regra: procedimento publicado DEVE apontar para versão publicada de processo.

## 8. Estados e transições
- draft -> published.

## 9. Services, repositories e actions esperados
- CRUD Actions.

## 10. UI esperada
N/A

## 11. Testes obrigatórios
- Unit e integrações de vínculo de chave.

## 12. Frontend impact
- Gap frontend pendente: 33B.

## 13. Critérios de aceite
- Procedimento só pode publicar se processo for published.

## 14. Regra de parada
Testes de regra passando.

## 15. Prompt para Jules Dev
`Implementar persistência de Living Procedures (Fase 33) vinculando com versões publicadas de processo.`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- Versionamento atrelado.
