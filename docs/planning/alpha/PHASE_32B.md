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

## 4. Domínio / DDD
- Application Use Case: ReviewObservation
- Persona: Gestor de Processos / Administrador
- Decisão Humana: Promover observação para Process Candidate ou rejeitar.
- Estados da Entidade: new, under_review, promoted, rejected.
- Erros de Domínio Visíveis: Rejeição sem justificativa bloqueada.
- Audit Trail / Receipt: Justificativa de rejeição registrada.

## 5. Escopo permitido
- UI de `/observations`.

## 6. Fora de escopo
- Edição total da observação, apenas aceite/rejeição.

## 7. Entidades e contratos
N/A

## 8. Estados e transições
- promote, reject.
- justificativa obrigatória para rejeição.

## 9. Services, repositories e actions esperados
- Actions de update de status.

## 10. UI esperada
- Rota `/observations`.
- Detalhe da observation e listagem.
- Link para Candidate criado.

## 11. Testes obrigatórios
- E2E.

## 12. Frontend impact
- `/observations` UI.

## 13. Critérios de aceite
- Rejeitar exige texto. Promover redireciona ou cria Candidate.

## 14. Regra de parada
Fluxo funcionando.

## 15. Prompt para Jules Dev
`Criar a UI de revisão de Observation (Fase 32B) permitindo promover ou rejeitar (com justificativa).`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- Ligação de Observation para Candidate.
