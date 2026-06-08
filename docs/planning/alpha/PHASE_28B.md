# Fase 28B — Agent Gateway Control Plane UI

## Objetivo
Criar a UI autenticada do Control Plane para monitorar o Agent Gateway.

## Contexto
A fase 28 criou o backend. Agora precisamos de visibilidade para os administradores da plataforma verem o que os agentes estão enviando.

## Arquivos permitidos
- Componentes UI para gateway control plane

## Arquivos proibidos
- Alterações na API de submissão do agente

## Regras
- Frontend Parity Gate: não avançar sem esta UI.
- A tela deve ser autenticada (área logada).

## Etapas
1. Criar tela de log/auditoria do gateway.
2. Exibir status de submissões, falhas e Correlation IDs.

## Validações
- Validar renderização visual das submissões.
- Teste de E2E para visualização correta.

## Relatório final esperado
- Tela de Control Plane do Gateway operacional.

## Regra de parada
Pare após garantir a paridade frontend.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 28B — Agent Gateway Control Plane UI

Objetivo:
Criar a UI autenticada do Control Plane para monitorar o Agent Gateway.

Implemente a UI para o Agent Gateway Control Plane, mostrando logs e submissões baseadas no backend criado na fase 28.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 28B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Agent Gateway Control Plane
- Rota(s): /builder/gateway ou /admin/gateway
- Usuário/persona: Admin da Plataforma
- Workspace/global: Global
- Estados cobertos: Lista vazia, lista populada, erro
- Teste visual/E2E: Visualizar lista de submissões mockadas ou reais.
- Gap frontend pendente: Nenhum
