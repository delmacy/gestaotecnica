# Fase 31 — n8n as Integration Boundary

## Objetivo
Estabelecer a abstração de webhook de entrada para o sistema, onde o n8n transportará os dados informais para o Builder.

## Contexto
O n8n atua apenas transportando sinais de Slack/WhatsApp. O System Builder precisa ter o webhook universal (inbox) para recebê-los.

## Arquivos permitidos
- `src/app/api/integrations/webhook/route.ts`
- `src/features/platform/integrations/webhook.service.ts`

## Arquivos proibidos
- Código próprio do n8n (não mexer em docker-compose do n8n).
- Lógica forte de runtime.

## Regras
- Todo webhook externo deve ser recebido, assinado (secret), desempacotado e salvo em uma tabela crua de `signal_inbox`.

## Etapas
1. Criar API Endpoint genérico para Webhooks.
2. Criar tabela simples `signal_inbox` ou similar usando Zod JSONB.

## Validações
- Retorno HTTP 202 imediato para o n8n para não bloquear a thread.

## Relatório final esperado
- Webhook Inbox ativo e exportado.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 31 — n8n as Integration Boundary

Objetivo:
Estabelecer a abstração de webhook de entrada para o sistema, onde o n8n transportará os dados informais para o Builder.

Escopo:
Apenas Endpoint universal de Webhook de integrações.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Crie o endpoint `/api/integrations/webhook` garantindo validação de segredo de integração.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de n8n as Integration Boundary. Pare e solicite review.
```
