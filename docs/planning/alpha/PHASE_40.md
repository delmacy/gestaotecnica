# Feature Contract — Fase 40
## 1. Identificação
- Fase: 40
- Nome: Agent Registry Backend
- Tipo: Backend
- Dependências: N/A
- Fase frontend vinculada: Fase 40B
- Status: Planejada refinada

## 2. Objetivo
Registro de agentes externos no sistema (`agent_registry`).

## 3. Problema que resolve
Criar chaves de acesso controladas e limites (scopes).

## 4. Escopo permitido
- Tabela `agent_registry`.

## 5. Fora de escopo
- Gerenciar LLM.

## 6. Entidades e contratos
- Entidade `agent_registry`: `id`, `key`, `name`, `type`, `status` (active | suspended | revoked), `scopes`, `created_at`, `updated_at`, `last_seen_at`.

## 7. Estados e transições
- active -> suspended | revoked.

## 8. Services, repositories e actions esperados
- Auth filter checando key no repo.

## 9. UI esperada
N/A

## 10. Testes obrigatórios
- Integ Auth.

## 11. Frontend impact
- Gap (40B).

## 12. Critérios de aceite
- Rejeitar acesso fora do escopo ou key suspensa.

## 13. Regra de parada
Testes passando.

## 14. Prompt para Jules Dev
`Implementar o registro de agentes no backend (Fase 40) com a tabela agent_registry e chaves vinculadas.`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
