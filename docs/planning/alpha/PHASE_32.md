# Feature Contract — Fase 32
## 1. Identificação
- Fase: 32
- Nome: Observation Pipeline Backend
- Tipo: Backend
- Dependências: Fase 31
- Fase frontend vinculada: Fase 32B
- Status: Planejada refinada

## 2. Objetivo
Estruturar o conceito e persistência de Observation a partir de sinais não estruturados.

## 3. Problema que resolve
Agrupa sinais brutos (Signal Inbox) em "Observações" determinísticas que podem ou não virar Process Candidates.

## 4. Domínio / DDD
- Bounded Context: Observation Context
- Ubiquitous Language:
  - Observation
  - Source Signal
  - Heurística de Agrupamento
- Aggregate/Entity principal: Observation
- Value Objects:
  - ObservationStatus
- Invariantes:
  - Observation deve apontar para pelo menos um Source Signal (external_event_id).
  - Promoção para Process Candidate requer revisão.
- Domain/Application Events:
  - ObservationCreated
- Application Use Case:
  - GroupSignalsIntoObservation
- Anti-Corruption Layer:
  - N/A (processamento interno)
- Repository Port:
  - ObservationRepositoryPort
- Infrastructure Adapter:
  - DrizzleObservationRepository
- Transaction Boundary:
  - Agrupamento de sinais em nova Observation.
- Consistency/Idempotency:
  - Não duplicar Observation para o mesmo lote de sinais já processados.
- Workspace Scope:
  - Isolamento por workspace_id.
- Audit/Trace:
  - Referência aos sinais fonte original.

## 5. Escopo permitido
- Tabela `observations` e lógica de agrupamento.

## 6. Fora de escopo
- IA Real.

## 7. Entidades e contratos
- Schema: `observations`
- Campos: `id`, `workspace_id`, `title`, `summary`, `status` (new | under_review | promoted | rejected), `evidence`, `source_signal_ids`, `created_at`, `updated_at`, `created_by_type` (system | human | agent).
- Regra de agrupamento: heurística simples (mesmo workspace, mesma source, mesmo categoria).

## 8. Estados e transições
- new -> under_review -> promoted | rejected.

## 9. Services, repositories e actions esperados
- Observation Repository/Service.

## 10. UI esperada
N/A

## 11. Testes obrigatórios
- Unit test de heurística de agrupamento.

## 12. Frontend impact
- Gap frontend pendente: Fase 32B.

## 13. Critérios de aceite
- Sinais pendentes do inbox são agrupados em Observations.

## 14. Regra de parada
Teste passando no builder agrupador.

## 15. Prompt para Jules Dev
`Implementar o modelo de dados de Observation (Fase 32) usando agrupamento determinístico.`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- IA real adiada, usando heurística local.
