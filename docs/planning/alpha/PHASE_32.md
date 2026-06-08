**Adendo documental — Frontend Parity Gate**

# Fase 32 — Observation Pipeline Backend

## Objetivo
Lógica de agrupamento de sinais em observations/evidence.

## Contexto
Sinais brutos não viram processo automaticamente; precisam ser consolidados em 'observations'.

## Arquivos permitidos
- Serviço de agrupamento de sinais
- Tabelas de Observation

## Arquivos proibidos
- Auto-gerar processos sem revisão

## Regras
- Sinais consolidados viram Observation, não Candidate de imediato.

## Etapas
1. Lógica para transicionar Signal -> Observation com base em heurísticas ou regras.

## Validações
- Testes de agrupamento de múltiplos sinais.

## Relatório final esperado
- Pipeline de observação backend concluído.

## Regra de parada
Pare após as regras de negócio de agrupamento estarem feitas.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 32 — Observation Pipeline Backend

Objetivo:
Lógica de agrupamento de sinais em observations/evidence.

Crie o backend para consolidar sinais (Signal Inbox) em Observations.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 32
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Pipeline
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: Agrupamento
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 32B
