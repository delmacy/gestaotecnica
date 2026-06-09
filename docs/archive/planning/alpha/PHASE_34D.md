# Feature Contract — Fase 34D
## 1. Identificação
- Fase: 34D
- Nome: FeatureProposal Approval Action
- Tipo: Backend/Frontend
- Dependências: Fase 34C
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Ação de aprovar/rejeitar proposta por humano com justificativa.

## 3. Problema que resolve
Adicionar a governança humana no topo das Feature Proposals.

## 4. Escopo permitido
- Services de decisão e botão na UI.

## 5. Fora de escopo
- Aplicação automática (Fase 34E).

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- pending -> approved/rejected.
- Autorização humana e justificativa.

## 8. Services, repositories e actions esperados
- Actions de Aprovar.

## 9. UI esperada
- Modals para aprovar e rejeitar com campo de texto.

## 10. Testes obrigatórios
- Unit test p/ garantir autorização.

## 11. Frontend impact
- `/changes` (Adição de botões).

## 12. Critérios de aceite
- Exigir Justificativa.

## 13. Regra de parada
Testes de UI/Backend passando.

## 14. Prompt para Jules Dev
`Implementar lógica de aprovação/rejeição manual para FeatureProposal (Fase 34D).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
