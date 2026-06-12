# Parity Matrix - UI Contracts Viewer

Esta matriz rastreia o alinhamento entre o contrato de UI, as restrições arquiteturais e o MVP a ser implementado. Serve de base para o audit e para as validações durante o desenvolvimento.

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Exibir contratos do Grupo A (implementados) | VISUAL_MODEL.md | Lista e lista detalhada | Sim (Static Index) | PLANEJADO | N/A | Mockar dados e criar UI |
| Exibir contratos do Grupo B (futuros) | VISUAL_MODEL.md | Lista e matriz | Sim (Static Index) | PLANEJADO | N/A | Mockar dados futuros |
| Exibir surface_id | STATIC_INDEX_CONTRACT.md | Header principal/Badge | Sim | PLANEJADO | N/A | Criar layout de badge |
| Exibir route_candidate | STATIC_INDEX_CONTRACT.md | Texto descritivo/link | Sim | PLANEJADO | N/A | Exibir no detalhe |
| Exibir purpose, persona e scope | STATIC_INDEX_CONTRACT.md | Blocos de texto/grid | Sim | PLANEJADO | N/A | Exibir no detalhe |
| Exibir implementation_status | STATIC_INDEX_CONTRACT.md | Pílula colorida (Badge) | Sim | PLANEJADO | N/A | Criar UI do Badge |
| Exibir related_reviews e related_tasks | STATIC_INDEX_CONTRACT.md | Bullet list simples | Sim | PLANEJADO | N/A | Listar como texto |
| Exibir frontend_risks | STATIC_INDEX_CONTRACT.md | Secção de alerta (Warning box) | Sim | PLANEJADO | N/A | Criar visual de alerta |
| Exibir evidence_required | STATIC_INDEX_CONTRACT.md | Seção em accordion ou box | Sim | PLANEJADO | N/A | Exibir no detalhe |
| Exibir matriz de implementação | MVP_PLAN.md | Tab dedicada com grid de visualização | Sim | PLANEJADO | N/A | Criar layout da matriz |
| Buscar por nome, rota ou surface_id | INTERACTION_RULES.md | Barra de busca global (client) | Não (Usa estado) | PLANEJADO | N/A | Criar hook de filter |
| Filtrar por grupo e status | INTERACTION_RULES.md | Dropdown e Toggle Buttons | Não (Usa estado) | PLANEJADO | N/A | Criar layout de filtros |
| Operar Read-Only | BOUNDARIES.md | Sem formulários, sem 'Save' | Não | PLANEJADO | N/A | Garantir visual lockado |
| Não editar Markdown | BOUNDARIES.md | Sem ações de write no filesystem | Não | PLANEJADO | N/A | Validar na auditoria |
| Não depender de filesystem runtime | BOUNDARIES.md | O index injeta o array estático no client | Não | PLANEJADO | N/A | Gerar arquivo TS puro |
| Não depender de banco | BOUNDARIES.md | Ausência de Drizzle Queries | Não | PLANEJADO | N/A | Validar na auditoria |
| Não depender de API | BOUNDARIES.md | Sem actions em `page.tsx` | Não | PLANEJADO | N/A | Validar na auditoria |
| Manter Grupo D bloqueado visualmente | MVP_PLAN.md | Badges de `blocked` | Sim (Static Index) | PLANEJADO | N/A | Mockar status bloqueado |
