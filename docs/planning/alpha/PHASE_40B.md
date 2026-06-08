# Feature Contract — Fase 40B
## 1. Identificação
- Fase: 40B
- Nome: Agent Registry UI
- Tipo: Frontend
- Dependências: Fase 40
- Fase frontend vinculada: N/A
- Status: Planejada refinada

## 2. Objetivo
Interface para listar e visualizar escopos dos agentes.

## 3. Problema que resolve
Visibilidade administrativa de quem tem chave de acesso (IA/Bots).

## 4. Escopo permitido
- `/admin/agents`.

## 5. Fora de escopo
- Configuração complexa de RBAC de agente.

## 6. Entidades e contratos
N/A

## 7. Estados e transições
- Listar/desativar agente.

## 8. Services, repositories e actions esperados
- Actions crud agente.

## 9. UI esperada
- Tabela `/admin/agents`. Erro, empty e loading.

## 10. Testes obrigatórios
- E2E.

## 11. Frontend impact
- `/admin/agents`.

## 12. Critérios de aceite
- Administrador consegue desativar acesso de um agente através da UI.

## 13. Regra de parada
Ação funcional de toggle de key.

## 14. Prompt para Jules Dev
`Implementar UI para Agent Registry (Fase 40B).`

## 15. Prompt para Jules Tester
`N/A`

## 16. Riscos e decisões
- N/A
