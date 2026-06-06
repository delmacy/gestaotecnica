# Fase 30 — Paperclip Integration Strategy

## Objetivo
Criar hooks locais na plataforma para suportar a infraestrutura de logging do Paperclip no futuro.

## Contexto
O Paperclip gerencia logs e tarefas agênticas. O System Builder precisará retornar 'Correlation IDs' nas respostas para a rastreabilidade do agente.

## Arquivos permitidos
- `src/features/platform/gateway/agent-gateway.service.ts` (modificação)
- `src/features/platform/gateway/gateway.types.ts`

## Arquivos proibidos
- Integração real de chamadas para APIs de terceiros.

## Regras
- Toda resposta da API do Gateway deve incluir um `correlation_id` e um recibo rastreável de que a ação foi apenas registrada como Candidate.

## Etapas
1. Atualizar o Gateway Service para aceitar e ecoar `correlation_id` e `idempotency_key` em suas transações.

## Validações
- Validação estrita do ID de correlação.

## Relatório final esperado
- API Gateway preparada para orquestração assíncrona rastreável.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 30 — Paperclip Integration Strategy

Objetivo:
Criar hooks locais na plataforma para suportar a infraestrutura de logging do Paperclip no futuro.

Escopo:
Apenas modificações nos retornos da API Gateway para acomodar meta-dados do Paperclip.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Implemente o suporte a `correlation_id` e `idempotency_key` no Agent Gateway.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Paperclip Integration Strategy. Pare e solicite review.
```
