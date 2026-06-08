# Feature Contract — Fase 37
## 1. Identificação
- Fase: 37
- Nome: Origin/Authorship Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 37B
- Status: Planejada refinada

## 2. Objetivo
Adicionar campos padronizados de rastreabilidade às entidades.

## 3. Problema que resolve
Saber de forma determinística (agente/humano/integração) quem iniciou um registro e com qual ID de auditoria de borda, preparando os dados gerados antes de expor aos multi-agentes.

## 4. Escopo permitido
- Schemas (`process_candidates`, `process_definitions`, `process_versions`).

## 5. Fora de escopo
- Tabelas não relacionadas a fluxos.

## 6. Entidades e contratos
- Campos: `origin_type` (human | agent | integration | imported | system), `origin_id` nullable, `created_by_id` nullable, `agent_id` nullable, `source_label` nullable, `source_trace_id` nullable.

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
- Update Zods e Repos.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Lint e compile check.

## 11. Frontend impact
- Gap (37B).

## 12. Critérios de aceite
- Campos migrados.

## 13. Regra de parada
Zod passando.

## 14. Prompt para Jules Dev
`Implementar Fase 37: Adicionar tipagem e campos de autoria/origem nas entidades canônicas.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Progressivo, não atinge todas de uma vez.
