**Adendo documental — Frontend Parity Gate**

# Fase 28 — Agent Gateway Backend

## Objetivo
Implementar a camada Server-Side da API protegida para os Agentes Externos (Boundary).

## Contexto
O System Builder não pode ser violado. Toda interação futura do Paperclip deve passar pelo Agent Gateway usando `x-agent-key`.
Apenas permite submissão de Process Candidates. O frontend será coberto na fase 28B.

## Arquivos permitidos
- `src/app/api/agent/route.ts`
- `src/features/platform/gateway/agent-gateway.service.ts`

## Arquivos proibidos
- Criação do Agente Paperclip em si.
- UI do gateway.

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
Não inicie o escopo da fase seguinte. Respeite os limites granulares definidos.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 28 — Agent Gateway Backend

Objetivo:
Implementar a camada Server-Side da API protegida para os Agentes Externos (Boundary).

Implemente o Agent Gateway backend focado na criação de Process Candidates via API. A UI será feita na próxima fase.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 28
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Agent Gateway (Backend apenas)
- Rota(s): /api/agent
- Usuário/persona: System / Agent
- Workspace/global: Global
- Estados cobertos: Sucesso, Unauthorized
- Teste visual/E2E: Não aplicável
- Gap frontend pendente: Fase 28B abrirá a UI para listar as submissões.
