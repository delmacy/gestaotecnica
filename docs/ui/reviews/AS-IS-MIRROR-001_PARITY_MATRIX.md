# AS-IS-MIRROR-001 Parity Matrix

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| exibir lista de mirrors | AS_IS_MIRROR.md | AsIsMirrorList (Sidebar) | Sim | PENDING | Nenhum | Implementar componente |
| exibir mapa de etapas | AS_IS_MIRROR.md | AsIsStepMap (Center) | Sim | PENDING | Nenhum | Implementar componente |
| exibir step_type | AS_IS_MIRROR.md | Badge em AsIsStepCard | Sim | PENDING | Nenhum | Implementar componente |
| exibir actor_role | AS_IS_MIRROR.md | Badge/Texto em AsIsStepCard | Sim | PENDING | Nenhum | Implementar componente |
| exibir input/output | AS_IS_MIRROR.md | Seção em AsIsStepDetailPanel | Sim | PENDING | Nenhum | Implementar componente |
| exibir handoffs | AS_IS_MIRROR.md | Seção em AsIsHandoffPanel | Sim | PENDING | Nenhum | Implementar componente |
| exibir system/document touchpoints | AS_IS_MIRROR.md | Seção em AsIsStepDetailPanel | Sim | PENDING | Nenhum | Implementar componente |
| exibir evidence links | AS_IS_MIRROR.md | Seção em AsIsEvidencePanel | Sim | PENDING | Nenhum | Implementar componente |
| exibir gap overlays | AS_IS_MIRROR.md | Overlays em mapa e AsIsGapOverlayPanel | Sim | PENDING | Nenhum | Implementar componente |
| exibir risk flags | AS_IS_MIRROR.md | Badges em etapas | Sim | PENDING | Nenhum | Implementar componente |
| exibir confidence | AS_IS_MIRROR.md | Cores/Ícones em etapas | Sim | PENDING | Nenhum | Implementar componente |
| exibir validation status | AS_IS_MIRROR.md | Badge global/etapa | Sim | PENDING | Nenhum | Implementar componente |
| exibir capability candidates | AS_IS_MIRROR.md | Seção em AsIsCapabilityPanel | Sim | PENDING | Nenhum | Implementar componente |
| diferenciar synthetic/mock/real_pending/real_blocked | AS_IS_MIRROR.md | Avisos/Cores visíveis | Sim | PENDING | Nenhum | Implementar UI global |
| operar sem fontes reais | AS_IS_MIRROR.md | Dependência de `as-is-mirror-data.ts` | Sim | PENDING | Nenhum | Criar mock data |
| não executar workflow | AS_IS_MIRROR.md | Ausência de botões de execução/submit real | Não | PENDING | Nenhum | Garantir na revisão |
| não validar processo real | AS_IS_MIRROR.md | Ações efêmeras | Não | PENDING | Nenhum | Garantir na revisão |
| não depender de banco | AS_IS_MIRROR.md | Sem `drizzle` no código | Não | PENDING | Nenhum | Garantir na revisão |
| não depender de runtime | AS_IS_MIRROR.md | Sem server actions de estado real | Não | PENDING | Nenhum | Garantir na revisão |
| não depender de API | AS_IS_MIRROR.md | Sem `fetch` | Não | PENDING | Nenhum | Garantir na revisão |
| manter Grupo D bloqueado | AS_IS_MIRROR.md | Registros e avisos no report/checklists | Não | PENDING | Nenhum | Atualizar Tasker |
