# Feature Contract — Fase 35
## 1. Identificação
- Fase: 35
- Nome: Metrics Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 35B
- Status: Planejada refinada

## 2. Objetivo
Service de agregação das métricas mínimas operacionais.

## 3. Problema que resolve
Visão de saúde dos processos sem ferramentas complexas de BI.

## 4. Escopo permitido
- Queries customizadas de metrics.

## 5. Fora de escopo
- BI completo.

## 6. Entidades e contratos
- Métricas: `total_instances`, `completed_instances`, `average_lead_time`, `completion_rate`, `failed_or_stalled_count`, `candidates_by_status`, `publication_count`.

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
- Aggregation Service.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Testes nas queries de agregação.

## 11. Frontend impact
- Gap pendente (35B).

## 12. Critérios de aceite
- Retorna JSON de metrics válido.

## 13. Regra de parada
Queries ok.

## 14. Prompt para Jules Dev
`Implementar as queries de agregação de métricas (Fase 35).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Simplicidade extrema no MVP.
