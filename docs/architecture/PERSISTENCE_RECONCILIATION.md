# Plano de Persistência Runtime e Reconciliação de Schemas

## 1. Mapa Atual (As-Is)

### Schemas no Banco de Dados
- `public`: Contém a grande maioria das tabelas, incluindo tabelas legacy e tabelas que deveriam estar em schemas arquiteturais.
- `builder`: Existe e contém `process_candidates`.
- `blueprints`: Existe.
- `notifications`: Existe.
- `drizzle`: Schema de controle de migrações.
- **Ausentes no Banco (mas presentes no Drizzle):** `identity`, `workspace`, `workflow`, `documents`, `assets_module`, `inventory`.

### Divergências Críticas
- **Drift de Schema:** Tabelas definidas nos schemas `workflow`, `workspace`, `identity` no código Drizzle estão fisicamente localizadas no schema `public` no banco de dados real.
- **Gap de Multi-tenancy:** Tabelas legacy como `reports`, `service_orders`, `assets`, `work_items` no schema `public` não possuem a coluna `workspace_id`.
- **Eventos:** Existe duplicidade conceitual entre `workflow.events` (no Drizzle) e `public.event_logs` (no Banco). No banco real, ambos parecem residir no `public`.

---

## 2. Mapa Alvo (To-Be)

O objetivo é alinhar a estrutura física com a arquitetura lógica definida no Drizzle.

| Domínio | Schema Alvo | Persistência Principal | workspace_id | Observação |
|---------|-------------|-------------------------|--------------|------------|
| Platform | `builder` | `process_candidates` | Sim | Usado para isolamento de novos módulos. |
| Identity | `identity` | `users`, `auth_accounts` | Não (Global) | Atualmente no `public`. |
| Workspace| `workspace` | `workspaces` | Sim (PK) | Atualmente no `public`. |
| Workflow | `workflow` | `process_instances`, `events` | Sim | Atualmente no `public`. |
| Traceability| `traceability`| `audit_logs` | Sim | Atualmente no `public`. |
| Legacy | `public` | `service_orders`, `assets` | **Faltante** | Necessita migração para adicionar `workspace_id`. |

---

## 3. Estratégia por Domínio

### 3.1. Approval Workflow (Clean Rebuild)
- **Persistência:** `builder.process_candidates`
- **Origin:** `approval`
- **Isolamento:** Filtragem obrigatória por `workspace_id`.
- **Histórico:** Gravação em `workflow.events` (fisicamente `public.events`).

### 3.2. Reconciliação de Schemas Arquiteturais
- **Estratégia:** Migration de movimentação de tabelas do `public` para seus schemas proprietários.
- **Ordem:** `identity` -> `workspace` -> `workflow` -> `traceability`.

### 3.3. Gap de Multi-tenancy (Legacy)
- **Estratégia:** Adição de coluna `workspace_id` UUID (nullable inicialmente, depois not null após backfill).
- **Tabelas Afetadas:** `reports`, `work_items`, `assets`, `service_orders`, `teams`, `technician_profiles`, `shifts`, `shift_log_entries`, `time_entries`, `users`, `auth_accounts`, `auth_sessions`.

---

## 4. Estratégia de Migração e Rollback

### Migração
1. **Fase 1: Preparação:** Criar schemas faltantes (`identity`, `workspace`, `workflow`, etc).
2. **Fase 2: Movimentação:** `ALTER TABLE public.x SET SCHEMA y`.
3. **Fase 3: Enriquecimento:** Adição de `workspace_id` em tabelas legacy.
4. **Fase 4: Validação:** Execução de `db:verify-ci`.

### Rollback
- Scripts reversos de `ALTER TABLE y.x SET SCHEMA public`.
- Remoção de colunas adicionadas (com cautela para não perder dados).

---

## 5. Riscos e Mitigação

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Quebra de Queries Hardcoded | Alto | Uso exclusivo do Drizzle ORM que mapeia os schemas corretamente. |
| Perda de Isolamento (Leak) | Crítico | Auditoria de queries para garantir que `workspace_id` está em todos os `where`. |
| Falha em Migração de Schema | Médio | Execução de migrações em transações atômicas. |
| Incompatibilidade com Legacy | Médio | Manter o schema `public` como fallback temporário via views se necessário. |

---

## 6. Módulos Dependentes
- `ApprovalWorkflowModule` (em reconstrução)
- `WorkIntakeModule`
- `CaseManagementModule`
- `ReportingModule`
