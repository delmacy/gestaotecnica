# Parity Matrix: Tasker Board

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| exibir backlog | BACKLOG.md | Coluna/lista de Backlog | Sim | documented | Nenhum | Implementar visualização |
| exibir sprint | SPRINT_BOARD.md | Dashboard sumário ou Tag | Sim | documented | Nenhum | Implementar visualização |
| exibir grupos A/B/C/D | TASKER_BOARD_MOCK_DATA_CONTRACT.md | Filtros e Badges no card | Sim | documented | Nenhum | Implementar visualização |
| exibir status | TASKER_BOARD_MOCK_DATA_CONTRACT.md | Colunas no Kanban | Sim | documented | Nenhum | Implementar visualização |
| exibir dependências | DEPENDENCIES.md | Área de detalhe do card | Sim | documented | Nenhum | Implementar painel de detalhe |
| exibir evidências | TASKER_BOARD_TRANSITION_RULES.md | Lista de links no detalhe | Sim | documented | Nenhum | Implementar painel de detalhe |
| exibir agente responsável | TASKER_BOARD_MOCK_DATA_CONTRACT.md | Avatar ou Role no card | Sim | documented | Nenhum | Implementar visualização |
| exibir bloqueios | TASKER_BOARD_TRANSITION_RULES.md | Ícone no card, motivo no detalhe | Sim | documented | Nenhum | Implementar visualização |
| bloquear done sem evidência | TASKER_BOARD_TRANSITION_RULES.md | Botão desabilitado com tooltip | Sim | documented | Necessário lógica de guard | Implementar lógica de botão |
| manter Grupo D bloqueado | SPRINT_BOARD.md | Cards do Grupo D não movíveis | Sim | documented | Nenhum | Implementar filtro estrito |
| usar dados sintéticos/mockados | DEC-SB-001.md | Client-side state | Sim | documented | Nenhum | Implementar array hardcoded |
| não depender de banco | Arquitetura | Sem chamadas à API de persistência | Não | documented | Nenhum | Restringir hooks ao client-side |
| não depender de runtime | Arquitetura | Ausência de chamadas ao motor de runtime | Não | documented | Nenhum | Restringir hooks ao client-side |
| não editar Markdown real | TASKER_BOARD.md | Alterações em memória, não em `fs` | Não | documented | Nenhum | Assegurar estado efêmero |