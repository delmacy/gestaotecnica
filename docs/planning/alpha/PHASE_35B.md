# Fase 35B — Workspace Dashboards

## Objetivo
Dashboards operacionais de processo por workspace.

## Contexto
Visualização do Process Intelligence, lead times, gargalos.

## Arquivos permitidos
- Componentes de Gráficos / Métricas na UI

## Arquivos proibidos
- Integração com sistemas pesados externos (PowerBI, etc)

## Regras
- Estados vazios e erro devem ser tratados.

## Etapas
1. Tela de dashboard agregando os KPIs.
2. Filtros por período/status.

## Validações
- Teste visual dos componentes com dados mockados/reais.

## Relatório final esperado
- Dashboard analítico em operação.

## Regra de parada
Pare após a UI de gráficos estar pronta.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 35B — Workspace Dashboards

Objetivo:
Dashboards operacionais de processo por workspace.

Crie o Workspace Dashboard para exibir as métricas de processos geradas na Fase 35.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 35B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Dashboards
- Rota(s): /[workspace]/dashboard
- Usuário/persona: Gestor Operacional
- Workspace/global: Workspace
- Estados cobertos: Gráficos, Listas de ofensores
- Teste visual/E2E: Verificar carregamento correto de stats.
- Gap frontend pendente: Nenhum
