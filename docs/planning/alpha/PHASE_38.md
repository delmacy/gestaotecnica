# Feature Contract — Fase 38

## 1. Identificação
- Fase: 38
- Nome: Workspace Consent Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 38B
- Status: Planejada refinada

## 2. Objetivo
Criar o backend para gerenciar o consentimento de observação de dados por workspace (opt-in para IA/agentes).

## 3. Problema que resolve
Garante que nenhum dado seja observado ou submetido via agentes sem autorização explícita do administrador do workspace, uma premissa de segurança para as próximas fases.

## 4. Escopo permitido
- Schemas do Drizzle (`workspace_agent_settings`).
- Validação no Agent Gateway.

## 5. Fora de escopo
- UI.

## 6. Entidades e contratos
- Entidade: `workspace_agent_settings`
- Campos: `workspace_id`, `agent_observation_enabled` (default false), `allowed_sources`, `updated_by_id`, `updated_at`.

## 7. Estados e transições
- Permite alterar `agent_observation_enabled` entre true/false.

## 8. Services, repositories e actions esperados
- Serviço para buscar/atualizar configurações.
- Gateway deve barrar submissão se false.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Unit e Integration.

## 11. Frontend impact
Gap pendente (38B).

## 12. Critérios de aceite
- Gateway rejeita requests para workspaces sem opt-in.

## 13. Regra de parada
Testes passando no gateway.

## 14. Prompt para Jules Dev
`Implementar Fase 38. Criar tabela workspace_agent_settings e bloquear requisições no Agent Gateway se o consentimento estiver desativado. Siga docs/planning/alpha/PHASE_38.md.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- Default é false.
