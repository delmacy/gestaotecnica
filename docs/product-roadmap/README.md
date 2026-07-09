# System Builder — Roadmap Operacional Canônico

Este diretório é a fonte oficial de planejamento comercial, fases, sprints e próximas tasks do System Builder.

## Fonte única

Leia nesta ordem:

1. `COMMERCIAL_DELIVERY_PLAN.md` — norte comercial, gates e release path.
2. `MODULE_MATURITY_ASSESSMENT.md` — percentual atual por módulo e principais gaps.
3. `PROJECT_BREAKDOWN.md` — fases, sprints candidatas e regra para transformar plano em tasks.
4. `EXECUTION_RULES.md` — regras determinísticas para agentes.
5. `INTERLEAVED_SPRINT_PLAN.md` — sequência intercalada por lane.
6. `AUTONOMOUS_BACKLOG_160_TASKS.md` — backlog detalhado de 160 microtasks para continuidade sem Codex.
7. `../../state/state.json` — versão JSON legível por automação do backlog autônomo.
8. `TASK_INDEX.md` — índice estável das tasks já catalogadas.

Documentos fora deste diretório são referência técnica, histórico ou insumo de módulo. Eles não substituem este roadmap, salvo quando forem explicitamente promovidos aqui.

## Roadmap operacional de 50 tasks

O catálogo atual possui 50 tasks principais. Cada task possui ID estável, tipo, dependências, modo de execução, escopo e critérios de aceite.

## Backlog autônomo expandido

`AUTONOMOUS_BACKLOG_160_TASKS.md` contém 16 sprints adicionais de 10 microtasks cada, com objetivo, arquivos permitidos/proibidos, aceite e validação. Ele deve ser usado quando for necessário continuar criando sprints com menor supervisão do Codex.

`state/state.json` contém a mesma fila em formato de máquina para o OpenCode Governor ou outro GPT materializar novas sprints sem acessar o servidor. Esse arquivo é planejamento versionado, não é o `state/state.json` operacional do container.

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

## Regra de atualização

Ao fim de cada sprint:

1. Atualize o status real das tasks.
2. Atualize `MODULE_MATURITY_ASSESSMENT.md` se a entrega mudou a maturidade comercial.
3. Atualize `PROJECT_BREAKDOWN.md` se a próxima sprint recomendada mudou.
4. Não aumente maturidade por PR aberto, sessão Jules finalizada ou UI mockada sem evidência de merge e revisão.
