# Fase 32B — Observation Review UI

## Objetivo
Interface para revisar observations e convertê-las em Process Candidates.

## Contexto
O humano revisa Observations consolidadas e decide se devem originar um novo processo.

## Arquivos permitidos
- UI de Observation

## Arquivos proibidos
- Processamento backend adicional

## Regras
- Permitir ação manual de conversão em Process Candidate.

## Etapas
1. Tela de listagem de Observations.
2. Ação de 'Promover a Process Candidate'.

## Validações
- Teste E2E promovendo observation a candidate.

## Relatório final esperado
- Tela de revisão funcional.

## Regra de parada
Pare após concluir o fluxo de revisão visual.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 32B — Observation Review UI

Objetivo:
Interface para revisar observations e convertê-las em Process Candidates.

Implemente a UI para revisar Observations e promover a Process Candidates.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 32B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Observation Review
- Rota(s): /[workspace]/observations
- Usuário/persona: Gestor Operacional / Arquiteto
- Workspace/global: Workspace
- Estados cobertos: Promover, Rejeitar, Agrupar
- Teste visual/E2E: Verificar fluxo de conversão.
- Gap frontend pendente: Nenhum
