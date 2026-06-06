# Fase 28 — Agent Gateway Specification

## Objetivo
Implementar a camada Server-Side da API protegida para os Agentes Externos (Boundary).

## Contexto
O System Builder não pode ser violado. Toda interação futura do Paperclip deve passar pelo Agent Gateway usando `x-agent-key`.

## Arquivos permitidos
- `src/app/api/agent/route.ts`
- `src/features/platform/gateway/agent-gateway.service.ts`

## Arquivos proibidos
- Criação do Agente Paperclip em si.

## Regras
- Restringir fortemente a API. Proibir PUT/POST que afetem workflows publicados diretamente.
- A API só deve aceitar a submissão de `Process Candidates`.

## Etapas
1. Criar a rota Next.js com middleware de API key simples.
2. Criar serviço que roteia a solicitação do Agente para a criação de um Candidate.

## Validações
- Testes via Curl/Postman retornando 401 sem token e 200 com payload estruturado de Candidate.

## Relatório final esperado
- Acesso seguro do gateway estabelecido.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 28 — Agent Gateway Specification

Objetivo:
Implementar a camada Server-Side da API protegida para os Agentes Externos (Boundary).

Escopo:
Apenas endpoints de controle `/api/agent/` e respectivo service local.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Construa o Agent Gateway validando o cabeçalho e impedindo modificações em produção.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Agent Gateway Specification. Pare e solicite review.
```
