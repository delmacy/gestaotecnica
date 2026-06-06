# Fase 39 — Paperclip-ready MVP Milestone

## Objetivo
Checagem global antes de declarar o System Builder pronto para receber integração do Paperclip.

## Contexto
Validar se a tese inteira, desde Candidate até Opt-In, foi coberta sem criar dependência circular de código com o Paperclip.

## Arquivos permitidos
- Todos os arquivos documentais e contratos de `src/features/platform/gateway` e `src/features/builder/candidates`.

## Arquivos proibidos
- Desenvolvimento de novos componentes visuais grandes.

## Regras
- Trata-se de uma fase de Hardening focada exclusivamente nos limites do Agent Gateway e Process Candidate.

## Etapas
1. Executar testes de integração ou simulações usando Mocks contra a API Gateway.
2. Garantir que as publicações automatizadas falham (401/403).

## Validações
- Testes rodando com sucesso provando bloqueios em segurança.

## Relatório final esperado
- Relatório final de segurança do Gateway e governança de candidatos.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 39 — Paperclip-ready MVP Milestone

Objetivo:
Checagem global antes de declarar o System Builder pronto para receber integração do Paperclip.

Escopo:
Hardening de Gateways.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Audite o acesso do Agent Gateway garantindo que, por design, ele é incapaz de alterar produção ou pular etapas de revisão humana.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Paperclip-ready MVP Milestone. Pare e solicite review.
```
