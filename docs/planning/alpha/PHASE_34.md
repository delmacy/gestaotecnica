**Adendo documental — Frontend Parity Gate**

# Fase 34 — Change Management Backend

## Objetivo
Modelo de FeatureProposal para propor mudanças controladas em processos.

## Contexto
Toda mudança deve ter impacto, risco e processo afetado registrados.

## Arquivos permitidos
- Tabelas e APIs de Change Management / FeatureProposal.

## Arquivos proibidos
- Alteração autônoma de regras sem aprovação

## Regras
- Proposta requer estado de revisão.

## Etapas
1. Modelo de proposta de mudança com métricas de impacto.

## Validações
- Testes de serviço de proposta.

## Relatório final esperado
- Backend de Change Management criado.

## Regra de parada
Pare antes da tela.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 34 — Change Management Backend

Objetivo:
Modelo de FeatureProposal para propor mudanças controladas em processos.

Implemente o backend de gestão de mudança (FeatureProposal) para processos existentes.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 34
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Changes
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: Draft, Pending Review, Approved
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 34B
