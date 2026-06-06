# Registro Histórico de Fases

Esta pasta guarda um arquivo por fase do System Builder.

Cada arquivo de fase funciona como registro histórico append-only.

## Diferença entre planning e phases

- `docs/planning/**`: plano da fase antes da implementação.
- `docs/phases/**`: histórico da fase, incluindo plano aprovado, execuções, revisões, correções e decisões.

## Regra append-only

Arquivos em `docs/phases/**` não devem ser sobrescritos para apagar histórico.

Agentes podem acrescentar seções novas, mas não devem remover execuções, revisões ou correções anteriores.

## Permissões

- Jules Documental cria e estrutura arquivos de fase.
- Jules Dev pode acrescentar relatório de execução ao arquivo da fase correspondente.
- Jules Dev não deve alterar `WORK_BOARD.md`, `NEXT_PHASE.md`, `STATUS_DAS_FASES.md` ou `DECISOES_ATIVAS.md`.
- ChatGPT/revisor pode orientar revisão ou acrescentar revisão, se autorizado.
