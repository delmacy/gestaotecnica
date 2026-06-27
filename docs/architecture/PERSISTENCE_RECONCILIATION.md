# Plano de Persistência Runtime e Reconciliação de Schemas

## 1. Decisão Operacional: Arquitetura de Dados

**Decisão:** Unificado Database com Multi-Schema Logicamente Isolados.
- **Justificativa:** Facilita a governança de schemas compartilhados (blueprints/registry) e reduz a sobrecarga de gerenciamento de instâncias, mantendo isolamento via PostgreSQL Schemas e `workspace_id` obrigatório.

---

## 2. Mapa de Domínios e Persistência

Abaixo, o detalhamento As-Is (Estado Atual) e To-Be (Estado Alvo) para todos os domínios da Wave 02 e módulos críticos.

| Domínio | As-Is (Físico) | To-Be (Físico) | Estratégia de Migração |
|---------|----------------|----------------|-------------------------|
| **Approval Workflow** | `public.service_orders` (legacy context) | `builder.process_candidates` (origin: approval) | Clean rebuild isolado. |
| **Work Intake** | `builder.process_candidates` | `workflow.work_items` | Promoção de staging para tipado. |
| **Reporting** | `public.reports` (Sem workspace_id) | `analytics.reports` | Adição de workspace_id + Movimentação de Schema. |
| **Universal Assets**| `public.assets` (Sem workspace_id) | `assets_module.assets` | Adição de workspace_id + Movimentação de Schema. |
| **Documents** | `public.technical_documents` | `documents.technical_documents` | Movimentação de Schema. |
| **Inventory** | `public.inventory_items` | `inventory.inventory_items` | Movimentação de Schema. |
| **Workforce** | `public.technician_profiles` | `workforce.technician_profiles` | Adição de workspace_id + Movimentação de Schema. |
| **Human Resources** | `public.users` (Global) | `identity.users` | Movimentação para schema identity. |
| **Case Management** | `builder.process_candidates` | `cases.cases` | Promoção de staging para tipado. |

---

## 3. Identidade e Propriedade (Identity Ownership)

**Modelo:** Identidade Global com Membresia por Tenant.
- **Global Identity (`identity` schema):** `users` e `auth_accounts` são globais (As-Is: `public`).
- **Tenant Membership (`workspace` schema):** Membresia via `user_role_assignments` (As-Is: `public`).

---

## 4. Estratégia de Eventos (Event Store)

**Loja Canônica:** `workflow.events`
- **Migração:** Ingestão de `public.event_logs`.
- **Deduplicação:** Chave composta `(entity_id, occurred_at, event_type)` para evitar duplicidade em replays.
- **Decommissioning:** `public.event_logs` será mantido como read-only por 1 ciclo de release após migração total e então dropado.
- **Compatibilidade:** Uso de adapter pattern no código para ler de ambas as tabelas durante a transição.

---

## 5. Exit Strategy: `process_candidates` (Staging to Typed)

`process_candidates` serve como persistência genérica para domínios em incubação (Approvals, Intake, Case Management).
- **Mecanismo de Promoção:** Quando o schema do domínio estabiliza, executa-se migration SQL `INSERT INTO target_table SELECT ... FROM process_candidates WHERE origin = 'x'`.
- **Versionamento:** Uso de `schema_version` no JSONB para suportar migrações incrementais antes da promoção física.

---

## 6. Políticas de Integridade e Performance

- **PK/FK:** UUID v4 obrigatório. FK obrigatória para `workspace.workspaces(id)` em todas as tabelas operacionais (incluindo legacy após backfill).
- **Índices:** B-Tree em `workspace_id` e GIN em campos de payload.
- **Delete Policies:** `RESTRICT` para preservar rastro de auditoria.

---

## 7. Backfill e Validação

### Backfill de `workspace_id`
- **Registros Ambíguos:** Registros sem workspace detectável serão atribuídos a um `system_orphan_workspace` para auditoria manual, nunca deletados silenciosamente.
- **Pré-validação:** Scripts de contagem e verificação de integridade de FK.
- **Pós-validação:** Aplicação de constraint `NOT NULL` e verificação via `db:verify-ci`.

---

## 8. Rollout e Rollback

### Rollout Staged
1. Criação de Schemas.
2. Migração de dados de Staging (`process_candidates`).
3. Adição de colunas em tabelas Legacy.
4. Movimentação de tabelas entre schemas.

### Critérios de Rollback
- **Gatilho:** Falha em > 1% das queries de produção ou detecção de leak de dados (cross-tenant).
- **Ação:** Reversão via `SET SCHEMA public` e restauração de backups em caso de corrupção de dados durante backfill.
