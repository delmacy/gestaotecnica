**Adendo documental — Frontend Parity Gate**

# Fase 31 — n8n Webhook Inbox Backend

## Objetivo
Criar a Inbox para recebimento de webhooks do n8n (signal_inbox).

## Contexto
O n8n é apenas um integrador, a plataforma centraliza a recepção via Inbox isolada.

## Arquivos permitidos
- Endpoint assinado
- Armazenamento de sinais crus

## Arquivos proibidos
- Lógica de processamento complexa imediata

## Regras
- Retornar HTTP 202 imediatamente.
- Isolar dados crus por workspace.

## Etapas
1. Criar endpoint de webhook validando assinatura.
2. Persistir na signal_inbox com status pendente.

## Validações
- Testes de webhook seguro.

## Relatório final esperado
- Endpoint webhook rodando e armazenando dados.

## Regra de parada
Pare após confirmar salvamento em banco.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 31 — n8n Webhook Inbox Backend

Objetivo:
Criar a Inbox para recebimento de webhooks do n8n (signal_inbox).

Implemente a API de recepção de webhooks do n8n focado no padrão Inbox/HTTP 202.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 31
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Webhook
- Rota(s): /api/webhooks/n8n
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: Sucesso 202, Erro de assinatura
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 31B
