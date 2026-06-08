**Adendo documental — Frontend Parity Gate**

# Fase 35 — Metrics Backend

## Objetivo
Consultas/Queries para lead time, rejeição, tempo de execução.

## Contexto
Process Intelligence básico extraindo dados das execuções de instâncias.

## Arquivos permitidos
- Views/Queries de agregação de métricas no banco

## Arquivos proibidos
- Instalação de ferramentas BI externas

## Regras
- Dados agrupados por workspace e processo.

## Etapas
1. Criar consultas analíticas sobre `action_executions` e instâncias.

## Validações
- Teste de output numérico das queries.

## Relatório final esperado
- APIs de métricas disponíveis.

## Regra de parada
Pare antes dos gráficos.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 35 — Metrics Backend

Objetivo:
Consultas/Queries para lead time, rejeição, tempo de execução.

Implemente os endpoints e queries SQL para extrair métricas de execução de processos (Lead time, throughput).
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 35
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Analytics
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: Agregação
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 35B
