# Feature Contract — Fase 35B
## 1. Identificação
- Fase: 35B
- Nome: Workspace Dashboards
- Tipo: Frontend
- Dependências: Fase 35
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Componentes visuais simples para exibir as métricas de processo (`/dashboard`).

## 3. Problema que resolve
Parity visual de Metrics.

## 4. Escopo permitido
- `src/app/(builder)/dashboard/...`

## 5. Fora de escopo
- Interações complexas, gráficos avançados (D3).

## 6. Entidades e contratos
N/A

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
- UI components (MetricCard, StatusBreakdown).

## 9. UI esperada
- Rota: `/dashboard`.
- Cards simples. Erro, empty, loading.

## 10. Testes obrigatórios
- Visual e E2E.

## 11. Frontend impact
- Rota `/dashboard`.

## 12. Critérios de aceite
- Dashboard renderiza componentes de métrica.

## 13. Regra de parada
UI testada e exibindo.

## 14. Prompt para Jules Dev
`Implementar o dashboard de métricas usando os componentes simples (Fase 35B).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
