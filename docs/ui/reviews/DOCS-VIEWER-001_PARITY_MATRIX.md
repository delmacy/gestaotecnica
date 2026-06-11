# Matriz de Paridade: Docs Viewer

| requirement | source_document | ui_representation | mock_data_needed | status | gap | next_action |
| --- | --- | --- | --- | --- | --- | --- |
| exibir documentos por categoria | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | UI lista de cards filtráveis | sim (DocsItem com categoria) | ready | nenhum | Implementar mock e view |
| exibir docs de manifesto/arquitetura | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir docs de tasker | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir UI contracts | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir capability docs | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir registry docs | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir review/readiness reports | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Lista filtrada e cards | sim | ready | nenhum | Implementar |
| exibir source_path | DOCS_VIEWER_VISUAL_MODEL.md | Painel de Detalhe | sim (campo source_path) | ready | nenhum | Implementar |
| exibir related_docs | DOCS_VIEWER_VISUAL_MODEL.md | Painel de Detalhe (seção inferior) | sim (campo related_docs) | ready | nenhum | Implementar |
| exibir related_tasks | DOCS_VIEWER_VISUAL_MODEL.md | Painel de Detalhe (seção inferior) | sim (campo related_tasks) | ready | nenhum | Implementar |
| buscar por título/slug/path | DOCS_VIEWER_VISUAL_MODEL.md | Topbar ou sidebar de busca | não (client side logic em mock data) | ready | nenhum | Implementar UI |
| filtrar por categoria/módulo/status | DOCS_VIEWER_VISUAL_MODEL.md | Seletores dropdown | não (client side logic) | ready | nenhum | Implementar UI |
| operar read-only | DOCS_VIEWER.md | Aviso global e ausência de botões save | não | ready | nenhum | Implementar aviso |
| não editar Markdown | DOCS_VIEWER_INTERACTION_RULES.md | Nenhuma textbox de edição renderizada | não | ready | nenhum | Manter fora de escopo |
| não depender de filesystem runtime | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Somente usa json/array estático | sim | ready | nenhum | Implementar |
| não depender de GitHub | DOCS_VIEWER.md | Ausência de chamadas à API do Git | não | ready | nenhum | Manter fora de escopo |
| não depender de banco | DOCS_VIEWER.md | Ausência de Prisma/Drizzle calls | não | ready | nenhum | Manter fora de escopo |
| não depender de runtime | DOCS_VIEWER.md | Somente cliente local render | não | ready | nenhum | Manter fora de escopo |
| não depender de fontes reais | DOCS_VIEWER_STATIC_INDEX_CONTRACT.md | Índice de mock explícito | sim | ready | nenhum | Implementar |