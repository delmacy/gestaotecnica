# Fase 40B — Agent Registry UI

## Objetivo
Tela autenticada para visualizar agentes autorizados e configurar limites.

## Contexto
Administradores da plataforma veem quais agentes estão conectados e o que podem fazer.

## Arquivos permitidos
- Painel de Agentes (Plataforma)

## Arquivos proibidos
- Tela de gestão de modelo LLM interno (é só integração)

## Regras
- Interface deve deixar claro os escopos (scopes) e status da conexão.

## Etapas
1. Lista de Agentes registrados.
2. Modal de detalhes com histórico e capacidades.

## Validações
- Testes visuais do grid e modais.

## Relatório final esperado
- UI de Registry multiagente pronta.

## Regra de parada
Final da fase Alpha de Agentes.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 40B — Agent Registry UI

Objetivo:
Tela autenticada para visualizar agentes autorizados e configurar limites.

Implemente a interface de gestão de Agentes no Control Plane, listando capacidades e permissões de cada um.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 40B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Admin Platform / Agents
- Rota(s): /admin/agents
- Usuário/persona: Platform Admin
- Workspace/global: Global
- Estados cobertos: Connected, Disconnected, Scopes
- Teste visual/E2E: Visualizar agentes listados.
- Gap frontend pendente: Nenhum
