**Adendo documental — Frontend Parity Gate**

# Fase 36 — Process Improvement Proposals Backend

## Objetivo
Lógica para derivar um ImprovementProposal de um workflow existente.

## Contexto
Envolve feedback contínuo. Sugestões de melhoria específicas para passos (steps).

## Arquivos permitidos
- Modelos e lógica para propostas de melhoria conectadas a nodes de workflow

## Arquivos proibidos
- Autocorreção de processo em tempo de execução

## Regras
- Proposta atrelada ao ID de um node específico.

## Etapas
1. API para submeter e consultar melhorias de workflow.

## Validações
- Teste validando proposta contra estrutura de processo ativa.

## Relatório final esperado
- Backend de sugestões de melhoria.

## Regra de parada
Pare antes da tela.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 36 — Process Improvement Proposals Backend

Objetivo:
Lógica para derivar um ImprovementProposal de um workflow existente.

Implemente o backend de Process Improvement Proposals, focando em sugestões em nível de nó (step).
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 36
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Backend Improvements
- Rota(s): N/A
- Usuário/persona: System
- Workspace/global: Workspace
- Estados cobertos: CRUD
- Teste visual/E2E: N/A
- Gap frontend pendente: Fase 36B
