# Docs Viewer

## Contrato de Superfície

- **surface_id:** UI-SURF-DOCS-VIEWER
- **surface_name:** Docs Viewer
- **purpose:** Oferecer uma visão navegável, organizada e estritamente read-only dos documentos centrais do System Builder, apoiando o desenvolvimento e o acompanhamento das regras arquiteturais, de capacidades e dos processos da plataforma.
- **persona:** Builder Architect, Platform Admin
- **route_candidate:** /builder/docs
- **scope:** Visualização navegacional de categorias de documentos estruturais em Markdown através de um índice estático simulado. Restrito apenas à leitura. Não edita, não persiste, não interage diretamente com o filesystem em runtime, e não é um CMS de documentação.
- **workspace_or_global:** Global (plataforma builder core).
- **related_capabilities:** platform_core
- **data_inputs:** Índice estático mockado contendo metadados (título, resumo, categoria, módulo, fase, status, caminhos para arquivos físicos, documentos relacionados e tarefas associadas). Buscas e filtros por categoria, status e módulo.
- **data_outputs:** Nenhuma saída persistida. Visualização de painéis de detalhe com read-only view.
- **commands:** Buscar, Filtrar por Categoria, Filtrar por Módulo, Filtrar por Status, Visualizar Detalhe, Visualizar Relacionamentos.
- **empty_state:** "Nenhum documento encontrado para estes filtros."
- **loading_state:** Estado não estritamente necessário por utilizar índice local simulado (ou skeleton loader rápido).
- **error_state:** Mensagem de erro caso a lista de mock falhe ou haja um estado inconsistente no viewer.
- **success_state:** Exibição clara e categorizada da listagem de documentos com capacidade de filtrar e ver detalhes.
- **permissions:** Acesso público ao System Builder (Platform Admin).
- **audit_events:** Sem registro real de auditoria no MVP read-only mock.
- **evidence_required:** Nenhuma no modo mock.
- **frontend_risks:** Baixo risco. Risco principal é criar confusão de que a interface edita o arquivo no git/filesystem local, deve ficar explicitamente sinalizado que é um visualizador estático mockado.
- **e2e_test_expectation:** 'O Platform Admin acessa /builder/docs, visualiza o aviso de modo estático mockado, busca por "manifest", filtra pela categoria e visualiza o painel de detalhes do PROJECT_MANIFEST sem capacidade de editá-lo.'
- **implementation_status:** documented