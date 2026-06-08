# Fase 37B — Origin Visibility UI

## Objetivo
Exibir badges e filtros por origem nos recursos do workspace e plataforma.

## Contexto
Usuários precisam saber rapidamente se a IA propôs aquilo ou se foi o João.

## Arquivos permitidos
- Badges e tooltips na UI

## Arquivos proibidos
- Poluição visual excessiva

## Regras
- Manter design limpo. Usar ícones descritivos (Sparkles para IA).

## Etapas
1. Adicionar badges na lista de processos, Candidates, e Observations.

## Validações
- Teste visual de diferentes origens.

## Relatório final esperado
- Visibilidade de origem operável.

## Regra de parada
Pare após incluir badges.

## Prompt pronto para Jules Dev
```text
Antes de implementar, leia:
AGENTS.md
docs/planning/FRONTEND_PARITY_GATE.md
docs/00-current/WORK_BOARD.md
docs/00-current/ANTI_ESCOPO_ATUAL.md

Fase 37B — Origin Visibility UI

Objetivo:
Exibir badges e filtros por origem nos recursos do workspace e plataforma.

Implemente badges e indicadores visuais (Human vs Agent) baseados no tracking criado na Fase 37.
```

## Prompt pronto para Jules Tester (se aplicável)
```text
Fase 37B
Execute os testes unitários e de integração validando os escopos e limites de permissões.
```

Frontend impact:
- Área afetada: General UI (Lists/Details)
- Rota(s): Múltiplas
- Usuário/persona: Todos
- Workspace/global: Workspace
- Estados cobertos: Badges
- Teste visual/E2E: Componente badge renderizado.
- Gap frontend pendente: Nenhum
