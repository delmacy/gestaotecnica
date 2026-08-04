-- RLS: Proteção no banco para tabelas críticas
-- Habilita Row-Level Security e cria políticas por workspace_id

-- === TABELAS RUNTIME (schema público) ===

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY events_workspace_isolation ON events
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY documents_workspace_isolation ON documents
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY document_versions_workspace_isolation ON document_versions
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY assets_workspace_isolation ON assets
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE asset_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY asset_history_workspace_isolation ON asset_history
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE process_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY process_definitions_workspace_isolation ON process_definitions
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE flow_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY flow_definitions_workspace_isolation ON flow_definitions
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE process_instances ENABLE ROW LEVEL SECURITY;
CREATE POLICY process_instances_workspace_isolation ON process_instances
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE process_payloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY process_payloads_workspace_isolation ON process_payloads
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY forms_workspace_isolation ON forms
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE action_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY action_executions_workspace_isolation ON action_executions
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE outbox_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY outbox_events_workspace_isolation ON outbox_events
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

ALTER TABLE process_candidates ENABLE ROW LEVEL SECURITY;
CREATE POLICY process_candidates_workspace_isolation ON process_candidates
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);

-- === TABELA LEGADO ===

ALTER TABLE work_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY work_items_workspace_isolation ON work_items
  USING (workspace_id = current_setting('app.workspace_id', true)::uuid);
