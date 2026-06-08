# Feature Contract — Fase 29

## 1. Identificação
- Fase: 29
- Nome: Agent Payload Contract
- Tipo: Backend / Documental
- Dependências: Fase 28B
- Fase frontend vinculada: Fase 29B
- Status: Planejada refinada

## 2. Objetivo
Definir o contrato JSON exato do payload aceito pelo Agent Gateway.

## 3. Problema que resolve
Agentes precisam de um contrato de payload tipado e robusto antes de começarem a enviar propostas reais com justificativas e evidências detalhadas.

## 4. Escopo permitido
- `src/features/platform/gateway/agent-gateway.service.ts` (ou similar de contratos).
- Schemas Zod de validação.

## 5. Fora de escopo
- Integração real com LLM.
- Execução autônoma de publicação.
- Paperclip real.

## 6. Entidades e contratos
Contrato sugerido:
- `workspaceId`, `name`, `description`, `proposedDefinition`, `evidence`, `source`, `agentType`, `suggestedForms`, `suggestedStates`, `justification`.
- Opcionais: `confidenceScore`, `observedSignals`.

## 7. Estados e transições
N/A

## 8. Services, repositories e actions esperados
N/A - Foco em atualização de tipagem e validação (Zod Schema) no gateway.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit: Testes de schema Zod (validar payloads corretos e rejeitar inválidos).

## 11. Frontend impact
N/A (Gap será fechado na 29B)

## 12. Critérios de aceite
- Zod schema atualizado e exportado para ser consumido na API.

## 13. Regra de parada
Quando os testes unitários do schema Zod passarem.

## 14. Prompt para Jules Dev
`Implementar a Fase 29. Refine o Agent Payload Contract (Zod schema) no Agent Gateway para incluir justification, suggestedForms, suggestedStates, evidence e source, conforme docs/planning/alpha/PHASE_29.md.`

## 15. Prompt para Jules Tester
`Verifique os testes unitários do payload schema.`

## 16. Riscos e decisões
- Decisão: O payload será rigoroso para evitar lixo gerado por agentes.
