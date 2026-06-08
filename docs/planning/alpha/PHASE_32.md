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

## 4. Escopo permitido
- Tabela `observations` e lógica de agrupamento.

## 5. Fora de escopo
- IA Real.

## 6. Entidades e contratos
- Schema: `observations`
- Campos: `id`, `workspace_id`, `title`, `summary`, `status` (new | under_review | promoted | rejected), `evidence`, `source_signal_ids`, `created_at`, `updated_at`, `created_by_type` (system | human | agent).
- Regra de agrupamento: heurística simples (mesmo workspace, mesma source, mesmo categoria).

## 7. Estados e transições
- new -> under_review -> promoted | rejected.

## 8. Services, repositories e actions esperados
- Observation Repository/Service.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit test de heurística de agrupamento.

## 11. Frontend impact
- Gap frontend pendente: Fase 32B.

## 12. Critérios de aceite
- Sinais pendentes do inbox são agrupados em Observations.

## 13. Regra de parada
Teste passando no builder agrupador.

## 14. Prompt para Jules Dev
`Implementar o modelo de dados de Observation (Fase 32) usando agrupamento determinístico.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- IA real adiada, usando heurística local.
