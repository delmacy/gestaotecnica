# Feature Contract — Fase 38B

## 1. Identificação
- Fase: 38B
- Nome: Workspace Consent UI
- Tipo: Frontend
- Dependências: Fase 38
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Interface para configurar o consentimento (opt-in) de IA no workspace.

## 3. Problema que resolve
Frontend Parity Gate da Fase 38.

## 4. Escopo permitido
- `src/app/(builder)/settings/ai/page.tsx` ou similar.

## 5. Fora de escopo
- Relatórios de uso de IA.

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- Salvando, erro, sucesso.

## 8. Services, repositories e actions esperados
- Action de toggle consent.

## 9. UI esperada
- Rota: `/settings/ai` ou conforme política.
- Switch toggle para habilitar.

## 10. Testes obrigatórios
- E2E.

## 11. Frontend impact
- Rota `/settings/ai`.

## 12. Critérios de aceite
- Usuário pode ligar/desligar opt-in.

## 13. Regra de parada
UI funcional atualizando o backend.

## 14. Prompt para Jules Dev
`Implementar Fase 38B. Criar UI em /settings/ai para o toggle de workspace consent criado na Fase 38.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Simplicidade inicial: um único botão de toggle.
