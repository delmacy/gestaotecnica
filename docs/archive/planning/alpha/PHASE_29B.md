# Feature Contract — Fase 29B

## 1. Identificação
- Fase: 29B
- Nome: Candidate Origin/Evidence Refinement
- Tipo: Frontend
- Dependências: Fase 29
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Refinar a UI existente de Candidate para exibir melhor a origem, evidências e justificativas vindas do payload do agente.

## 3. Problema que resolve
Garante o Frontend Parity Gate para os novos campos definidos na Fase 29.

## 4. Escopo permitido
- `src/components/builder/candidates/CandidateDetail.tsx`
- Componentes de listagem.

## 5. Fora de escopo
- Criação de logs de Gateway.

## 6. Entidades e contratos
N/A - Consome os dados expandidos de Candidate.

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
N/A

## 9. UI esperada
- Componentes visuais para `justification`, `evidence` estruturada, e `suggestedForms`.

## 10. Testes obrigatórios
- Teste visual.

## 11. Frontend impact
- Área afetada: Candidate Detail.

## 12. Critérios de aceite
- Detalhes adicionais do agente são visíveis na UI do candidato.

## 13. Regra de parada
Após atualizar o componente `CandidateDetail.tsx`.

## 14. Prompt para Jules Dev
`Implementar a Fase 29B. Atualize CandidateDetail.tsx para renderizar a justificativa e evidências com base no novo contrato de payload da Fase 29.`

## 15. Prompt para Jules Tester
`Validar a UI de Candidate Detail com um mock que inclua os novos campos.`

## 16. Riscos e decisões
- Reconhece o estado atual e evolui iterativamente.
