# Auditoria de Modelagem e Alinhamento Arquitetural: System Builder

Este documento apresenta uma análise crítica profunda da arquitetura e modelagem de dados do System Builder, avaliando sua viabilidade como plataforma B2B SaaS (100 a milhares de clientes).

## Resumo Executivo

**Pontos Fortes:**
1. Adoção recente de design modular separando `platform` e `runtime`.
2. Modelagem orientada a eventos (`events`, `outbox_events`).
3. Separação de Identidade e Workspace baseada em padrões.

**Pontos Fracos:**
1. **Falta generalizada de índices (Indexes):** A ausência massiva de índices nas chaves estrangeiras (`workspace_id`, `organization_id`, etc.) criará lentidão crítica rapidamente.
2. **Uso de Enums hardcoded em campos de `status` e `type` no schema antigo, contrastando com campos de texto livres no schema novo:** O modelo `workflow` adotou `text` puro para estados, abandonando a integridade do DDL (ou Check Constraints) que evita lixo de dados.
3. **Uso perigoso de `workspace_id` implícito:** Muitas consultas globais poderão causar "Data Bleeding" (vazamento entre tenants) caso o filtro de workspace seja esquecido pela camada de aplicação (falta RLS nativo no Postgres).

**Riscos Críticos:**
- **Data Bleeding (Vazamento de Tenant):** Sem Row-Level Security (RLS) no PostgreSQL, um bug no backend pode facilmente expor dados do Cliente A para o Cliente B.
- **Table Scans Massivos:** Tabelas transacionais pesadas (como `process_payloads`, `events`, `outbox_events`) vão travar o banco de dados em queries de filtragem por falta de índices.

**Riscos Médios:**
- Falta de UNIQUE Constraints para evitar duplicação semântica (ex: mesmo usuário com mesmo papel no mesmo workspace).
- `JSONB` não indexado (GIN) nas definições de formulários (`forms`, `field_definitions`), dificultando buscas complexas no runtime no-code.

---

## 1. Auditoria de Índices (Task 1)

A maior parte dos novos schemas (`identity`, `workspace`, `workflow`, `documents`) foi criada **completamente sem declaração de índices** para chaves estrangeiras cruciais.

**Riscos Encontrados:**
- Ausência de índice em *todos* os `workspace_id` e `organization_id`.
- Ausência de índice para `process_version_id` nas tabelas `states`, `transitions` e `actions`.
- Ausência de índice no `actor_id` (para listagem do que cada usuário fez).

**Recomendações:**
1. **Índices de Multi-Tenancy:** Adicionar índices simples/compostos começando por `workspace_id` em todas as tabelas transacionais (`events`, `process_instances`, `documents`). Ex: `CREATE INDEX idx_events_workspace ON workflow.events(workspace_id);`
2. **Índices GIN para JSONB:** Se atributos no `payload` ou `data` dos processos vão ser pesquisados no no-code builder, crie `CREATE INDEX idx_payload_jsonb ON workflow.process_payloads USING GIN (data);`
3. **Índices para Workflow Engine:** `idx_process_instances_state` para rápida recuperação dos processos pendentes de uma etapa.

---

## 2. Auditoria de Restrições de Integridade (Task 2)

**Riscos Encontrados:**
- `identity.users` não possui amarração estrita para evitar que a mesma role seja atribuída duas vezes.
- As Foreign Keys estão criadas sem comportamento de deleção explícito (`.onDelete("cascade")` ou `"restrict"`). Quando um tenant for excluído, os registros ficarão órfãos ou causarão erro de restrição dependendo do comportamento padrão (restrict).

**Recomendações:**
1. Adicionar constraints UNIQUE compostas. Ex: `UNIQUE(workspace_id, user_id)` na tabela `workspace_members`.
2. Adicionar `.onDelete("cascade")` para artefatos do workflow caso um `workspace` seja deletado (Cuidado: apenas se for regra de negócio deletar hard, senão usar Soft Delete e RLS).

---

## 3. Auditoria do Sistema de Permissões (Task 3)

O sistema conta com `users`, `roles` e `permissions`, indicando suporte a RBAC nativo (com policies baseadas em condition via JSONB para ABAC básico).

**Respostas:**
- **Como recebem papéis?** Atualmente não há uma tabela de junção `user_roles` explícita no novo schema analisado; é provável que precise ser implementada na associação do `workspace_members`.
- **Global e Workspace?** A tabela `roles` suporta `workspace_id` nulo para papéis globais. Correto.
- **Risco de Escalonamento:** Alto. Sem uma estrutura rigorosa de vinculação (ex: `user_roles` com restrição de workspace explícita), pode-se atribuir permissão cruzada.

**Recomendação:**
Criar a tabela `user_roles (user_id, role_id, workspace_id)` ou garantir que a amarração `workspace_members` contemple o papel explícito.

---

## 4. Auditoria de Multi-Tenancy (Task 4)

**Estratégia Atual:** "Shared Database, Shared Schema". O modelo confia exclusivamente na camada ORM / API para injetar `where(eq(workspaceId, X))` em toda query.

**Avaliação:**
Esta abordagem para 1.000 clientes é o **padrão mais frágil e arriscado**. Um desenvolvedor júnior que esquecer o filtro em uma rota expondo um GET vazará dados de todos os clientes.

**Recomendação Absoluta:**
Implementar **Row-Level Security (RLS)** nativo do PostgreSQL.
- Todos os requests autenticados devem setar o context no banco: `SET local request.jwt.claims = '{ "workspace_id": "xxx" }'`.
- Aplicar `ALTER TABLE workflow.events ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON workflow.events USING (workspace_id = current_setting('app.current_workspace_id')::uuid);`.
- Isso garante **isolamento garantido pelo Kernel do banco**.

---

## 5. Auditoria de Chaves de Negócio (Keys) (Task 5)

A modelagem usa intensamente campos `key` (ex: `key: text("key").notNull().unique()` em `organizations`, `workspaces`, `capabilities`, `forms`).

**Avaliação:**
As chaves estão corretamente marcadas como `unique()`. No entanto, elas são usadas no código legado para referenciar lógica estática (ex: `shift-logs`).
**Convenção Recomendada:** Utilizar `kebab-case` ou `snake_case` padronizado. Assegurar que são Imutáveis (Impedir UPDATE no campo `key` pela API).

---

## 6. Auditoria de Status e Estados (Task 6)

**Problema Crítico:**
A maioria das tabelas de `workflow` está usando `text("status").notNull().default("active")` puro.
Diferente do schema legacy (que usava `pgEnum`), o novo esquema abandonou checagens de validação de banco para domínios finitos.

**Avaliação:** Isso permite estados inválidos como `status = "AtiVo"` gerando corrupção lógica do motor de workflow.

**Recomendações:**
Ou se utiliza **PostgreSQL ENUMs** para o ciclo de vida fixo da plataforma (ex: "draft", "published", "archived"), ou **CHECK Constraints**.
Para estados puramente dinâmicos (processos definidos pelo cliente), a relação via ID do `currentStateId` (`states.id`) já resolve a questão de forma robusta.

---

## 7. Auditoria do Runtime Dinâmico (Task 7 - No-Code Builder)

**Avaliação da Modelagem (`field_definitions`, `forms`, `form_fields` e `process_payloads`):**
O modelo foi construído utilizando um padrão híbrido Entity-Attribute-Value (EAV simplificado via metadados) combinado com o padrão de **Documentos (JSONB)** no `process_payloads`.

**Respostas:**
- **O modelo é realmente dinâmico?** Sim, entidades dependem do motor de formulários e os dados vão para o `JSONB`.
- **Criação sem migrations?** Sim. É um padrão flexível (Schema-less runtime).
- **Gargalos e Riscos:** Se os relatórios dos clientes ou as regras de negócio precisarem buscar massivamente "Me traga todos os processos onde o `process_payloads.data->>'valor_nf'` seja maior que 100", o banco de dados desabará (Table Scan completo) caso não haja estratégias de Indexação GIN para caminhos dinâmicos JSONB, ou materialização (Views indexadas) para propriedades quentes.

---

## 8. Auditoria de Escalabilidade (Task 8)

Projetando o sistema:
- **100 clientes:** Funciona tranquilamente como está (desde que adicionem os índices básicos de foreign key).
- **1.000 clientes:** Gargalos brutais em `events` e `outbox_events` (filas). Precisará de particionamento (Table Partitioning do PostgreSQL) nessas tabelas baseadas em data (`created_at`).
- **10.000 clientes:** "Shared Schema" sem RLS e sem particionamento é insustentável.

**Limites Arquiteturais:** A tabela `outbox_events` tenderá a inflar rapidamente se houver falhas de processamento ou se não houver job de arquivamento/cleanup.

---

## 9. Pontuação Técnica

- **Modelagem de banco:** **6/10** (Falta de índices e constraints de ON DELETE impactam muito).
- **Multi-tenancy:** **4/10** (Vulnerável a Data Bleed por depender apenas do ORM).
- **Sistema de permissões:** **5/10** (Incompleto; falta vinculação explícita workspace_members <-> roles).
- **Integridade de dados:** **6/10** (Abandono de Enums/Checks nos novos schemas).
- **Escalabilidade:** **7/10** (Uso de JSONB é moderno, mas falta particionamento para logs/eventos).
- **Runtime dinâmico:** **8/10** (Boa estrutura de definição separada da instância).

---

## 10. Top 10 Problemas e Recomendações

1. **Ausência Total de Índices FKs:** (Severidade: Crítica) | Criar índices no Drizzle para todas as chaves estrangeiras.
2. **Data Bleed em Multi-Tenancy:** (Severidade: Crítica) | Implementar PostgreSQL RLS.
3. **Ausência de Associação User <-> Role:** (Severidade: Alta) | Criar a tabela ou a coluna no `workspace_members`.
4. **Estados em Texto Livre:** (Severidade: Alta) | Usar ENUM ou Check Constraint nos campos estáticos (`status`).
5. **Busca JSONB não indexada:** (Severidade: Média) | Implementar GIN index em `process_payloads`.
6. **Orfanato de Dados (Sem Cascade/Restrict):** (Severidade: Alta) | Definir `onDelete()` nas relações Drizzle.
7. **Único Ponto de Falha no Outbox:** (Severidade: Média) | Criar tabela arquivada ou particionamento em `outbox_events`.
8. **Falta de Índices de Tenant nas Definições (Builder):** (Severidade: Alta) | Queries do Builder (ex: list states) precisam ser escopadas e indexadas por `workspace_id`.
9. **Falta de UNIQUE Constraints de Domínio:** (Severidade: Média) | Prevenir duplicações lógicas no DB (ex: mesmo form_field para o mesmo form com a mesma config).
10. **Tamanho Ilimitado em Logs:** (Severidade: Média) | Eventos e auditoria podem estourar disco sem um mecanismo de expiração.

---

## 11. Roadmap de Correções

**Correções Imediatas (Próximo Sprint):**
- Adicionar índices de Foreign Keys nos Drizzle schemas (principalmente `workspace_id` e ID's de relacionamento).
- Implementar Constraints de UNIQUE adequadas.
- Definir regras de deleção (Cascade/Restrict) explícitas no schema.

**Antes do Primeiro Cliente Comercial:**
- Implementar e testar Row-Level Security (RLS) no banco (fundamental para segurança jurídica SaaS).
- Corrigir a modelagem de associação do sistema de RBAC.
- Mudar campos `status` chaves para Postgres ENUM.

**Antes de 100 Clientes:**
- Indexação GIN otimizada para as consultas dinâmicas dentro de formulários/JSONB.

**Antes de 1.000 Clientes:**
- Implementar Table Partitioning nativo no PG para `events`, `outbox_events` e relatórios de runtime.
- Arquitetura Híbrida (Isolamento via Tenant-Specific Schemas/Databases dependendo do plano de assinatura).
