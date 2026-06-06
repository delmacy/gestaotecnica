# Fase 29 — Process Builder Agent Specification

## Objetivo
Documentar e mockar a estrutura do primeiro Agente autorizado a interagir com o Gateway.

## Contexto
O Process Builder Agent será a entidade Paperclip responsável por observar recorrências. Precisamos mockar os payloads que ele vai enviar.

## Arquivos permitidos
- `src/features/platform/gateway/mocks/agent-payload.mock.ts`

## Arquivos proibidos
- Nenhuma lógica de Machine Learning real ou Langchain/OpenAI.

## Regras
- O foco é ter a interface JSON exata que o agente emitirá para propor um Candidate (estado sugerido, formulário inferido, justificativa).

## Etapas
1. Criar os mocks em TypeScript refletindo a proposta hipotética de um agente.
2. Inserir um teste de snapshot no gateway validando este mock.

## Validações
- Mocks testáveis contra o schema do gateway.

## Relatório final esperado
- Payload do agente mapeado e mockado estritamente.

## Regra de parada
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos acima.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 29 — Process Builder Agent Specification

Objetivo:
Documentar e mockar a estrutura do primeiro Agente autorizado a interagir com o Gateway.

Escopo:
Restrito à estruturação do JSON mock do Process Builder Agent.

Não alterar:
- Produção de Runtime oficial sem aprovação.
- Publicar workflows de forma automatizada por agentes.

Regras:
Ater-se ao escopo definido na documentação técnica. O System Builder é o core, o Agent apenas sugere.

Etapas:
1. Desenvolva o Mock Payload de acordo com a ontologia do Agentic Process Discovery.

Validações:
Testes locais sem erros TS e validação visual onde aplicável.

Relatório final:
Liste os arquivos tocados e comprove a aderência à tese de Process Candidates.

Regra de parada:
Não ultrapassar a fronteira de Process Builder Agent Specification. Pare e solicite review.
```
