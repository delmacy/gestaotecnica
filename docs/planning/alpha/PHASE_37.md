**Adendo documental — Frontend Parity Gate**

# Fase 37 — Agent/Human Dual Elicitation Backend

## Objetivo
Persistir explicitamente a origem (manual/agente) em todos os níveis de definição.

## Contexto
Toda parte do processo deve indicar quem elicitiou/sugeriu (Agente vs Humano).

## Arquivos permitidos
- Ajustes em schemas base (adicionar campos de origem/autor)

## Arquivos proibidos
- Perda de dados existentes

## Regras
- Registrar autor ID e tipo (bot vs user).

## Etapas
1. Adicionar e popular dados de tracking de origem nas tabelas críticas.

## Validações
- Testes validando salvamento de origem.

## Relatório final esperado
- Capacidade de dual elicitation estruturada.

## Regra de parada
Pare antes da tela.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 37 — Agent/Human Dual Elicitation Backend

Objetivo:
Persistir explicitamente a origem (manual/agente) em todos os níveis de definição.

Atualize a base de dados e os serviços do Builder para registrar de forma audível se uma definição veio de um humano ou de um agente.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 37
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Tracking
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Global / Workspace
- Estados cobertos: Tracking origin
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 37B
