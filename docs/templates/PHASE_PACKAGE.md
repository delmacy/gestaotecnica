# Template de pacote de fase

Copie as seções abaixo para uma nova pasta em `docs/phases/<ID-slug>/`.

## `README.md`

```markdown
# <ID> — <Título>

Status: `planned`

## Objetivo

## Resultado de produto

## Escopo incluído

## Fora de escopo

## Dependências e gates

## Definição de pronto

## Referências
```

## `TASKS.md`

```markdown
# Tasks — <ID>

| ID | Título | Tipo | Dependências | Estado | Aceite resumido | PR |
|---|---|---|---|---|---|---|
| <ID>-001 | ... | development | — | planned | ... | — |
```

## `PROGRESS.md`

```markdown
# Progresso — <ID>

Atualizado em: AAAA-MM-DD
Estado da fase: `planned`
Task atual: —

## Resumo

## Registro

| Task | Implementação | PR | Merge | Validação | Estado | Evidência |
|---|---|---|---|---|---|---|

## Bloqueios

## Próximos passos
```

## `DECISIONS.md`

```markdown
# Decisões — <ID>

| ID | Data | Decisão | Motivo | Consequências |
|---|---|---|---|---|
```

## `evidence/<TASK-ID>.md`

Use o contrato em `docs/agents/EVIDENCE_CONTRACT.md`.
