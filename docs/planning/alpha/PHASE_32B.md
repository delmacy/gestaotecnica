# Feature Contract — Fase 32B
## 1. Identificação
- Fase: 32B
- Nome: Observation Review UI
- Tipo: Frontend
- Dependências: Fase 32
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Interface para humano promover/rejeitar Observation para Process Candidate.

## 3. Problema que resolve
Permite controle humano no pipeline de observação.

## 4. Escopo permitido
- UI de `/observations`.

## 5. Fora de escopo
- Edição total da observação, apenas aceite/rejeição.

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- promote, reject.
- justificativa obrigatória para rejeição.

## 8. Services, repositories e actions esperados
- Actions de update de status.

## 9. UI esperada
- Rota `/observations`.
- Detalhe da observation e listagem.
- Link para Candidate criado.

## 10. Testes obrigatórios
- E2E.

## 11. Frontend impact
- `/observations` UI.

## 12. Critérios de aceite
- Rejeitar exige texto. Promover redireciona ou cria Candidate.

## 13. Regra de parada
Fluxo funcionando.

## 14. Prompt para Jules Dev
`Criar a UI de revisão de Observation (Fase 32B) permitindo promover ou rejeitar (com justificativa).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Ligação de Observation para Candidate.
