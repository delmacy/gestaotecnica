# DEV-REVIEW-BUILDER-SHELL-001 Checklist

| item | status | evidence | issue | decision |
|---|---|---|---|---|
| topbar presente | Pass | `Topbar.tsx` implementado | None | Approved |
| sidebar presente | Pass | `Sidebar.tsx` implementado | None | Approved |
| dashboard `/builder` presente | Pass | `page.tsx` no builder refatorado | None | Approved |
| modo sintético visível | Pass | Badge vermelho/laranja "SYNTHETIC" no Topbar | None | Approved |
| workspace mockado visível | Pass | Placeholder visual no Topbar com `CURRENT_WORKSPACE.name` | None | Approved |
| módulos ativos visíveis | Pass | Lista ativa no `Sidebar.tsx` via `ACTIVE_MODULES` | None | Approved |
| módulos futuros desabilitados | Pass | Lista futura no `Sidebar.tsx` via `FUTURE_MODULES` | None | Approved |
| placeholders das rotas filhas presentes | Pass | Criação de pages genéricas mockadas para as sub-rotas | None | Approved |
| sem banco | Pass | Código analisado não tem chamadas a schema/Drizzle | None | Approved |
| sem migration | Pass | Sem SQL/arquivos de migration gerados | None | Approved |
| sem auth real | Pass | Dados do usuário vem de `MOCK_USER` | None | Approved |
| sem RBAC real | Pass | Componentes UI sem restrições ou checks condicionais de auth | None | Approved |
| sem runtime | Pass | Nenhum request/hook para motor de execução | None | Approved |
| sem n8n | Pass | Não há requisições para N8N | None | Approved |
| sem Gestão Técnica real | Pass | Sem terminologia Gestão Técnica (apenas System Builder Platform) | None | Approved |
| lint executado ou justificativa registrada | Pass | Executado no terminal; erros de global cache (`[ERR_MODULE_NOT_FOUND]: Cannot find package 'eslint' imported from /app/eslint.config.mjs`) registrados e justificados no report; erro de ambiente preexistente que não compromete o escopo do UI do Shell. | None | Approved |
| build executado ou justificativa registrada | Pass | `npm run build` executado; build estático (Static HTML/Route app) gerado com sucesso para as rotas da aplicação em `17.9s`. | None | Approved |