# SB-CR-09 — Implementar proteção no banco para tabelas críticas

## O que foi feito

1. Migration \src/db/migrations/0002_enable_rls.sql\:
   - Habilita RLS em 14 tabelas: events, documents, document_versions, assets, asset_history,
     process_definitions, flow_definitions, process_instances, process_payloads, forms,
     action_executions, outbox_events, process_candidates, work_items
   - Cria política de isolamento por workspace_id usando \current_setting('app.workspace_id')\

2. Helper \src/platform/workspace/rls.ts\:
   - \setSessionWorkspaceId(workspaceId)\ — configura \pp.workspace_id\ na sessão PostgreSQL

3. Integração em \esolveWorkspaceContext\:
   - Chama \setSessionWorkspaceId\ automaticamente ao resolver contexto de workspace
   - Best-effort: não bloqueia se o banco não suportar RLS

## Arquivos alterados
- src/db/migrations/0002_enable_rls.sql (novo)
- src/platform/workspace/rls.ts (novo)
- src/platform/workspace/resolve-workspace-context.ts (modificado)

## Verificação
- Migration executável via drizzle-kit ou SQL direto
- Helper importável e testável isoladamente
- Context resolution já integra o setConfig automaticamente
