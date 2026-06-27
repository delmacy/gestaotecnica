# System Builder — Roadmap operacional de 50 tasks

Este diretório é a fonte oficial das próximas tasks do produto. Cada task possui ID estável, tipo, dependências, modo de execução, escopo e critérios de aceite.

## Regra de execução

O executor deve receber somente o ID e o caminho da sprint. Exemplo:

> Busque a task `SB-S01-T01` em `docs/product-roadmap/sprint-01-backlog-governance/README.md`, cumpra integralmente o contrato da task, publique uma branch e abra um PR isolado.

## Estados permitidos

- `planned`
- `ready`
- `in_progress`
- `review`
- `blocked`
- `approved`
- `merged`
- `superseded`

## Regras globais

1. Uma task por branch e PR, salvo quando a task declarar explicitamente execução documental sem PR próprio.
2. Toda branch nasce da `main` atual.
3. Não misturar arquivos de tasks, módulos ou sprints diferentes.
4. Não confiar em `workspaceId`, `actorId`, roles ou ownership vindos de input público.
5. Toda mudança funcional deve incluir testes comportamentais.
6. Antes do PR: `git diff --name-only origin/main...HEAD`, testes aplicáveis, typecheck, build e architecture check.
7. Nenhum executor faz merge automático.
8. Reviews e testes independentes não devem ser executados pelo mesmo agente que produziu a implementação quando houver executor separado disponível.
9. Tasks paralelas só podem rodar quando não houver dependência e os diretórios permitidos não se sobrepuserem.
10. Divergência entre descrição e diff real bloqueia aprovação.

## Sprints

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

## Índice rápido

Consulte `TASK_INDEX.md` para localizar qualquer task por ID, sprint, tipo ou dependência.