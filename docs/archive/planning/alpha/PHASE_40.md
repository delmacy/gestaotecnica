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

## 4. Domínio / DDD
- Bounded Context: Platform / Builder Context
- Ubiquitous Language:
  - Agent Registry
  - Agent Key
  - Scopes
- Aggregate/Entity principal: AgentRegistry
- Value Objects:
  - AgentStatus
- Invariantes:
  - Chave revogada barra acesso imediato na camada de adapter (Auth filter).
- Domain/Application Events:
  - AgentRegistered
  - AgentKeyRevoked
- Application Use Case:
  - RegisterAgent
  - RevokeAgentKey
- Anti-Corruption Layer:
  - N/A
- Repository Port:
  - AgentRegistryRepositoryPort
- Infrastructure Adapter:
  - DrizzleAgentRegistryRepository
- Transaction Boundary:
  - N/A
- Consistency/Idempotency:
  - Agent key unique.
- Workspace Scope:
  - Global ou associado a tenant dependendo da decisão de auth.
- Audit/Trace:
  - last_seen_at

## 5. Escopo permitido
- Tabela `agent_registry`.

## 6. Fora de escopo
- Gerenciar LLM.

## 7. Entidades e contratos
- Entidade `agent_registry`: `id`, `key`, `name`, `type`, `status` (active | suspended | revoked), `scopes`, `created_at`, `updated_at`, `last_seen_at`.

## 8. Estados e transições
- active -> suspended | revoked.

## 9. Services, repositories e actions esperados
- Auth filter checando key no repo.

## 10. UI esperada
N/A

## 11. Testes obrigatórios
- Integ Auth.

## 12. Frontend impact
- Gap (40B).

## 13. Critérios de aceite
- Rejeitar acesso fora do escopo ou key suspensa.

## 14. Regra de parada
Testes passando.

## 15. Prompt para Jules Dev
`Implementar o registro de agentes no backend (Fase 40) com a tabela agent_registry e chaves vinculadas.`

## 16. Prompt para Jules Tester
`N/A`

## 17. Riscos e decisões
- N/A
