# Fase 34B — Change Proposal UI

## Objetivo
Tela para gerenciar e revisar propostas de mudança.

## Contexto
Aprovação humana visual do FeatureProposal.

## Arquivos permitidos
- Painel de propostas de mudança

## Arquivos proibidos
- Processo de publicação automática sem clique humano

## Regras
- Mostrar status, impacto e risco de forma visual.

## Etapas
1. UI de listagem e revisão das propostas.
2. Ação de 'Aprovar Mudança' (gera nova versão de processo).

## Validações
- Teste E2E de aprovação de proposta gerando versão.

## Relatório final esperado
- Interface de Change Proposal finalizada.

## Regra de parada
Pare após a UI estar operacional.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 34B — Change Proposal UI

Objetivo:
Tela para gerenciar e revisar propostas de mudança.

Crie a interface para listar, analisar e aprovar Propostas de Mudança em processos.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 34B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Change Management UI
- Rota(s): /[workspace]/changes
- Usuário/persona: Process Owner
- Workspace/global: Workspace
- Estados cobertos: Lista, Detalhe, Aprovação
- Teste visual/E2E: Fluxo de aprovação.
- Gap frontend pendente: Nenhum
