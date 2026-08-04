# Roadmap operacional legado — catálogo SB-S01 a SB-S10

> Status: `reconciliation_required`
>
> Este diretório não é mais a fonte global de status ou seleção automática de trabalho. A fonte canônica é `docs/current/` e cada fase executável está em `docs/phases/`.
>
> As tasks deste catálogo continuam preservadas até serem classificadas como `migrated`, `superseded` ou `still_active`. Nenhum agente deve executar um ID daqui sem que ele também esteja registrado na pasta de fase proprietária.

Este diretório contém o roadmap histórico de 50 tasks. Cada task possui ID estável, tipo, dependências, modo de execução, escopo e critérios de aceite.

## Regra de execução atual

O executor recebe o ID e o caminho da task em `docs/phases/<FASE>/TASKS.md`. Caso a task ainda exista somente neste diretório, ela deve primeiro passar pela reconciliação documental.

## Estados preservados

- `planned`
- `ready`
- `in_progress`
- `review`
- `blocked`
- `approved`
- `merged`
- `superseded`

## Regras históricas ainda válidas

1. Uma task por branch e PR, salvo contrato explícito.
2. Não misturar arquivos de tasks, módulos ou sprints diferentes.
3. Não confiar em `workspaceId`, `actorId`, roles ou ownership vindos de input público.
4. Toda mudança funcional inclui testes comportamentais.
5. Antes do PR: diff, testes aplicáveis, typecheck, build e architecture check.
6. Nenhum executor declara validação do próprio trabalho sem evidência independente quando houver reviewer/tester disponível.
7. Tasks paralelas só rodam sem dependência e sem sobreposição material.
8. Divergência entre descrição e diff bloqueia aprovação.

## Catálogo histórico

| Sprint | Tema | Tasks | Dependência principal |
|---|---|---:|---|
| 01 | Backlog e governança | 01–05 | nenhuma |
| 02 | Contratos centrais e eventos | 06–10 | Sprint 01 |
| 03 | Onboarding e membership | 11–15 | Sprint 02 |
| 04 | Capabilities e manifests | 16–20 | Sprint 02–03 |
| 05 | Builder e publicação | 21–25 | Sprint 04 |
| 06 | Módulos da vertical comercial | 26–30 | Sprint 02–04 |
| 07 | Integração vertical | 31–35 | Sprint 03–06 |
| 08 | Persistência tipada | 36–40 | Sprint 06–07 |
| 09 | Segurança e observabilidade | 41–45 | Sprint 02–08 |
| 10 | Deploy e prontidão comercial | 46–50 | Sprint 07–09 |

Consulte `TASK_INDEX.md` apenas para localizar IDs históricos. O status real deve ser verificado na fase canônica.

## Trilhas futuras preservadas

- `FEDERATED_INSTANCE_SCOPE.md` — federação, instâncias gerenciadas, portabilidade e suporte remoto auditável.
- `UX_NAVIGATION_EXTENSION_TASKS.md` — UX-NAV-06 e UX-NAV-07.
- `REAL_DATA_PATH_POST_UX_REMODEL.md` — caminho de dados reais posterior aos gates UX.

Essas trilhas continuam futuras e gated conforme `docs/current/ROADMAP.md`.
