# Fase 36B — Improvement Proposal UI

## Objetivo
Interface para criar/revisar melhoria de processo, comparando atual vs proposto.

## Contexto
O Process Owner precisa aprovar as melhorias sugeridas.

## Arquivos permitidos
- UI de Diff/Comparação entre configuração atual e sugerida

## Arquivos proibidos
- Modificação de histórico auditável

## Regras
- O usuário deve aprovar ou rejeitar claramente.

## Etapas
1. Tela de revisão exibindo lado a lado.
2. Ação de Merge/Aprovar.

## Validações
- Teste visual do Diff de configuração.

## Relatório final esperado
- Painel de revisão de melhoria concluído.

## Regra de parada
Pare após verificar a interface e o merge funcional.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 36B — Improvement Proposal UI

Objetivo:
Interface para criar/revisar melhoria de processo, comparando atual vs proposto.

Crie a interface que permite visualizar e aprovar sugestões de melhoria (Diff) em processos.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 36B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: Process Improvements UI
- Rota(s): /[workspace]/improvements
- Usuário/persona: Process Owner
- Workspace/global: Workspace
- Estados cobertos: Diff View, Approve, Reject
- Teste visual/E2E: Verificar o componente de comparação visual.
- Gap frontend pendente: Nenhum
