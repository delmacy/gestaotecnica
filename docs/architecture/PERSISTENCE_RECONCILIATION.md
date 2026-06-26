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

## 2. Decisão Operacional: Arquitetura de Dados

**Decisão:** Unificado Database com Multi-Schema Logicamente Isolados.
- **Justificativa:** Facilita a governança de schemas compartilhados (blueprints/registry) e reduz a sobrecarga de gerenciamento de centenas de instâncias RDS, mantendo isolamento via PostgreSQL Schemas e `workspace_id` obrigatório em todas as tabelas operacionais.

---

## 3. Estratégia por Domínio (Wave 02)

| Domínio | Schema Proprietário | Persistência Principal | Estratégia de Isolamento |
|---------|---------------------|-------------------------|--------------------------|
| **Approval Workflow** | `workflow` | `process_candidates` (Origin: approval) | Workspace ID + Origin Filter |
| **Work Intake** | `workflow` | `work_items` | Workspace ID |
| **Reporting** | `analytics` | `reports` | Workspace ID |
| **Universal Assets**| `assets_module` | `assets` | Workspace ID |
| **Documents** | `documents` | `technical_documents` | Workspace ID |
| **Inventory** | `inventory` | `inventory_items` | Workspace ID |

---

## 4. Identidade e Propriedade (Identity Ownership)

**Modelo:** Identidade Global com Membresia por Tenant.
- **Global Identity (`identity` schema):** Usuários (`users`) e Contas (`auth_accounts`) são globais.
- **Tenant Membership (`workspace` schema):** A relação entre usuários e workspaces é mediada por `user_role_assignments`, garantindo que um usuário possa pertencer a múltiplos tenants com permissões distintas.

---

## 5. Estratégia de Eventos (Event Store)

**Loja Canônica:** `workflow.events`
- **Migração:** O conteúdo de `public.event_logs` será migrado para `workflow.events`.
- **Evolução:** Módulos novos devem emitir eventos diretamente para o schema `workflow`.
- **Imutabilidade:** Nenhuma linha no schema de eventos pode ser alterada após a inserção.

---

## 6. Exit Strategy: `process_candidates`

`process_candidates` é uma área de "staging" e isolamento para módulos em incubação.
- **Critério de Saída:** Quando um domínio atinge maturidade de esquema (estabilidade de campos > 1 sprint), os dados devem ser migrados para tabelas tipadas no schema proprietário.
- **Mecanismo:** Pipeline de migração de dados (Insert Select) e atualização de referências de ID no `event_store`.

---

## 7. Políticas de Integridade e Performance

- **Primary Keys (PK):** UUID v4 obrigatório em todas as tabelas.
- **Foreign Keys (FK):** Todas as tabelas operacionais devem ter FK para `workspace.workspaces(id)`.
- **Índices:**
  - B-Tree em `workspace_id` para filtragem de tenant.
  - GIN em campos `jsonb` de payloads/configurações.
  - Índices compostos `(workspace_id, key/code)` para buscas de negócio.
- **Políticas de Deleção:** `ON DELETE RESTRICT` para evitar órfãos em cascata indesejada; Soft delete recomendado para entidades principais.

---

## 8. Migração de Schema e Backfill

### 8.1. Movimentação de Schemas (Dependency-Safe)
1. Criar schemas alvo.
2. `ALTER TABLE public.table SET SCHEMA new_schema`.
3. Re-garantir permissões de usuário de aplicação nos novos schemas.
4. **Rejeição de Fallback:** Views de compatibilidade no schema `public` são expressamente proibidas a longo prazo. O código deve ser atualizado para referenciar schemas explícitos.

### 8.2. Backfill de `workspace_id`
1. **Pre-validação:** Contagem de registros nulos em tabelas operacionais.
2. **Backfill:** Script de atualização baseado no `owner` ou `creator` original.
3. **Pós-validação:** Check constraints `NOT NULL` aplicadas após verificação de zero nulos.

---

## 9. Riscos e Mitigação

- **Risco de Performance em Join Cross-Schema:** Mitigado por índices de workspace em ambos os lados do join.
- **Drift de Migração:** Uso de `db:verify-ci` em cada PR para garantir que o banco real reflete o Drizzle.
