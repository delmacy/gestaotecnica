# Sprint Review — Sprint 01: Backlog e Governança

## 1. Resumo executivo

O resultado geral da auditoria da Sprint 01 é positivo quanto à organização dos artefatos, mas a sprint permanece bloqueada devido a uma inconsistência crítica no catálogo mestre de tarefas. Os processos de inventário (T01), normalização (T02) e validação (T03) foram executados, mas o validador automático aponta falhas que impedem a transição segura para a T05.

**Prontidão da Sprint 01:** Parcial. Artefatos integrados, mas catálogo inválido.
**Blockers:** Um blocker de alta severidade identificado (Ausência da T00 no índice), que impede a validação automática e a descoberta determinística.
**Riscos:** Médio. Iniciar a T05 com o catálogo em estado de falha pode induzir o agente a erros de contexto ou dependência.
**Recomendação para T05:** Bloquear até que o catálogo passe integralmente no validador.

## 2. Escopo revisado

### Arquivos auditados
- `docs/product-roadmap/TASK_INDEX.md`
- `docs/product-roadmap/ARCHITECTURE_CONTEXT.md`
- `docs/product-roadmap/EXECUTION_RULES.md`
- `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY.md`
- `docs/product-roadmap/sprint-01-backlog-governance/NORMALIZED_TASK_MAP.md`
- `docs/product-roadmap/sprint-01-backlog-governance/TASK_CATALOG_VALIDATOR.md`
- `scripts/validate-task-catalog.mjs`
- `scripts/__tests__/validate-task-catalog.test.mjs`

### PRs revisados
- #356 (T00)
- #358 (T01)
- #359 (T02)
- #360 (T03)

### Comandos executados
- `node scripts/validate-task-catalog.mjs`
- `node --test scripts/__tests__/validate-task-catalog.test.mjs`
- `git log --graph --oneline --all`
- `curl -H "Authorization: token $GITHUB_TOKEN" ...` (GitHub REST API)

## 3. Findings

| finding_id | severity | category | artifact | evidence | impact | recommendation | corrective_owner | blocks_t05 |
|---|---|---|---|---|---|---|---|---|
| S01-R-001 | high | missing-task | TASK_INDEX.md | Erro MISSING_REFERENCE no validador | Falha na validação automática do catálogo | Incluir SB-S01-T00 no TASK_INDEX.md | governance | sim |
| S01-R-002 | low | evidence | PR #358 | Descrição omite BACKLOG_INVENTORY_TEMPLATE.md | Divergência documental menor | Aceitar como dívida; melhorar templates de PR | governance | não |
| S01-R-003 | low | scope | PR #359 | Diff incluiu BACKLOG_INVENTORY.md acidentalmente | Ruído no histórico do PR | Já mitigado na descrição do PR; nenhuma ação necessária | governance | não |
| S01-R-004 | low | documentation | PR #360 | Placeholder [HEAD_SHA_AFTER_COMMIT] na descrição | Falta de rastreabilidade exata via texto | Usar SHAs reais após o commit final; dívida aceita | governance | não |
| S01-R-005 | informational | dependency | NORMALIZED_TASK_MAP.md | SB-S06-T28 sem sucessor em PR #332/#342 | Assimetria de dependências | Normalizar sucessores na próxima task corretiva do mapa | governance | não |
| S01-R-006 | informational | unmapped | NORMALIZED_TASK_MAP.md | IDs candidatos (SB-S02-T07-C, SB-S08-T36-C) | Itens aguardando decisão | Decidir inclusão em sprints futuras | governance | não |

## 4. Severidades

- **critical**: Bloqueia a integridade do sistema ou segurança.
- **high**: Bloqueia o fluxo de governança ou automação.
- **medium**: Divergência material que exige correção em curto prazo.
- **low**: Inconsistência documental ou de metadados sem impacto operacional.
- **informational**: Registro de observação ou melhoria futura.

## 5. Categorias

- `missing-task`: Task obrigatória ausente em documento mestre.
- `duplicate`: IDs ou artefatos redundantes.
- `state-mismatch`: Divergência entre estado declarado e estado real (GitHub).
- `dependency`: Problemas em predecessores, sucessores ou ciclos.
- `scope`: Arquivos fora do diretório permitido ou escopo excedido.
- `documentation`: Falhas em descrições, readmes ou guias.
- `validation`: Falhas apontadas pelo script de validação.
- `evidence`: Falta de comprovação de entrega ou SHAs.
- `unmapped`: Itens sem destino definido.

## 6. Matriz de duplicidades

| canonical_item | duplicate_or_related_item | relationship | evidence | decision |
|---|---|---|---|---|
| SB-S06-T26 | PR #334, Issue #348 | related artifacts | Ambos referem-se ao domínio Workforce/HR | Consolidado sob T26; PR #334 é a entrega parcial |
| SB-S06-T27 | PR #336 | related artifact | Tentativa anterior de Inventory Rebuild | T27 exigirá nova execução (clean rebuild) |
| SB-S06-T28 | Issue #339, PR #332, PR #342 | related artifacts | Múltiplas tentativas de Approval Workflow | T28 consolidará o trabalho reaproveitável |
| SB-S02-T06 | PR #344 | canonical delivery | Merge commit 49451da | T06 considerada concluída e integrada |

## 7. Matriz de itens unmapped

| origin_id | current_state | proposed_destination | decision | justification |
|---|---|---|---|---|
| Issue #312 | open | superseded | Mark as superseded | Substituída pela abordagem de persistência da Sprint 08 |
| PR #340 | closed-unmerged | SB-S02-T07-C | Candidate | Trabalho de idempotência a ser avaliado na Sprint 02 |
| PR #343 | ready | unmapped | Keep historical | PR administrativo de limpeza; não é task de produto |
| PR #354 | ready | unmapped | Keep historical | Expansão documental integrada via roadmap central |
| PR #333 | merged | unmapped (ref T30) | Reference | Testes de isolamento integrados; base para T30 |
| PR #338 | merged | unmapped | Historical reference | Case Management integrado; sem task de refino nas 50 inicia |
| PR #323, #324, #328 | merged | unmapped | Historical reference | Módulos integrados (Reports, Intake, Assets) |

## 8. Matriz de tasks parcialmente entregues

| task_id | existing_artifacts | verified_delivery | missing_scope | recommendation |
|---|---|---|---|---|
| SB-S01-T01 | BACKLOG_INVENTORY.md | Integrado via commits (544b65b) | Nenhum | Considerar concluída |
| SB-S06-T26 | PR #334 (HR Module) | Merged (9ce1018) | Scheduling, Cases, Approval integration | Executar refino na Sprint 06 |
| SB-S06-T28 | PR #332, #342 | Closed (não integrado) | Clean rebuild completo | Re-execução obrigatória na Sprint 06 |

## 9. Resultado do validador

### Comando
`node scripts/validate-task-catalog.mjs`

### Exit Code
`1` (Falha)

### Erros Reproduzidos
- `MISSING_REFERENCE`: ID "SB-S01-T00" refers to a task not found in TASK_INDEX.
- `MISSING_REFERENCE`: Predecessor "SB-S01-T00" does not exist (relatado na SB-S01-T01).

### Relação com Findings
Os erros confirmam o finding **S01-R-001**. O validador está funcionando corretamente e detectando a inconsistência entre o mapa de tarefas normalizado (que usa T00) e o índice oficial (que omitiu T00).

## 10. Dívidas aceitas

- Placeholder de SHA no PR #360 (Dívida documental).
- Omissão de metadados de T00 na descrição da T01 (Dívida documental).
- Itens unmapped integrados (Assets, Reports) sem task de refino nas 50 iniciais (Dívida de cobertura).

## 11. Blockers da T05

| finding | arquivo | correção necessária | critério de encerramento |
|---|---|---|---|
| S01-R-001 | TASK_INDEX.md | Adicionar SB-S01-T00 como task preparatória | Validador retornar Exit Code 0 |

## 12. Plano corretivo

| prioridade | arquivo | mudança recomendada | task responsável | antecipar T05 | PR separado |
|---|---|---|---|---|---|
| Alta | TASK_INDEX.md | Incluir linha para SB-S01-T00 | PR Corretivo | Sim | Sim |
| Média | NORMALIZED_TASK_MAP.md | Corrigir assimetrias de sucessores e unmappeds | Sprint 02 (T01/T02 review) | Não | Não |

## 13. Decisão final

**BLOCKED_FOR_T05**

A Sprint 01 permanece bloqueada devido ao finding **S01-R-001**. A T05 só poderá ser iniciada após a execução de um PR corretivo separado que atenda aos seguintes critérios:
- Inclua `SB-S01-T00` no `TASK_INDEX.md` ou formalize uma regra equivalente para tasks preparatórias;
- Garanta que o comando `node scripts/validate-task-catalog.mjs` retorne **exit code 0**;
- Preserve integralmente o fluxo técnico e cronológico: `T00 → T01 → (T02 || T03) → T04 → T05`.
