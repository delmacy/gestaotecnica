**Adendo documental — Frontend Parity Gate**

# Fase 29 — Process Builder Agent Payload Contract

## Objetivo
Documentar e mockar a estrutura do payload de Candidates enviado por Agentes.

## Contexto
Precisamos definir o contrato JSON exato que o agente usará para propor Candidates.

## Arquivos permitidos
- `src/features/platform/gateway/mocks/agent-payload.mock.ts`

## Arquivos proibidos
- Lógica real de agentes (LLMs, Langchain, etc)

## Regras
- Payload deve contemplar estado sugerido, formulário e justificativa.

## Etapas
1. Criar interfaces e mocks do payload.
2. Validar mock contra gateway.

## Validações
- Validação de schema no Zod.
- Teste de snapshot.

## Relatório final esperado
- Contrato do agente mapeado e mockado.

## Regra de parada
Pare após validar o contrato.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 29 — Process Builder Agent Payload Contract

Objetivo:
Documentar e mockar a estrutura do payload de Candidates enviado por Agentes.

Crie o contrato de payload para Process Candidates propostos por agentes.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 29
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Nenhuma diretamente (Mock)
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Global
- Estados cobertos: N/A
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 29B para exibir esse payload.
