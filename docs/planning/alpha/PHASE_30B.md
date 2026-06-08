# Fase 30B — Agent Receipts and Traceability UI

## Objetivo
Criar painel de recibos e rastreabilidade para interações de agentes.

## Contexto
Apresentar os logs de `correlation_id` e recibos criados na Fase 30.

## Arquivos permitidos
- UI de auditoria e logs

## Arquivos proibidos
- Mudanças nas rotas de API

## Regras
- Incluir filtros por workspace, agente, status.

## Etapas
1. Criar tela de recibos.
2. Ligar recibos ao Process Candidate gerado.

## Validações
- Testes visuais da listagem e filtros.

## Relatório final esperado
- Painel de recibos operável.

## Regra de parada
Pare após confirmar a rastreabilidade visual.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 30B — Agent Receipts and Traceability UI

Objetivo:
Criar painel de recibos e rastreabilidade para interações de agentes.

Crie o painel visual para listar recibos e interações dos agentes.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 30B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Auditoria / Gateway
- Rota(s): /builder/gateway/receipts
- Usuário/persona: Admin da Plataforma / Gestor
- Workspace/global: Global / Workspace
- Estados cobertos: Lista de recibos, link para candidate
- Teste visual/E2E: Buscar por correlation ID e listar.
- Gap frontend pendente: Nenhum
