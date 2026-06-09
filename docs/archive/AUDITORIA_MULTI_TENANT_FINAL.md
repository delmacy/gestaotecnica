# Auditoria de Validação Multi-Tenant

O objetivo desta auditoria é atestar o nível de isolamento de dados entre clientes (Tenants) no System Builder.

## Estado Atual da Arquitetura

O sistema adota o padrão **"Shared Database, Shared Schema"**.
Os dados de múltiplos clientes coexistem nas mesmas tabelas físicas (como `workflow.events` e `workflow.process_instances`).
O isolamento depende atualmente de cláusulas `WHERE workspaceId = X` injetadas manualmente através de queries na aplicação, valendo-se do Prisma/Drizzle.

## Riscos Encontrados (Data Bleed)
- Falha Humana: Uma única rota da API escrita sem o `.where(eq(events.workspaceId, wsId))` retornará dados de toda a base global.
- Cross-Tenant: Durante a execução de Processos, se o `FlowRunner` não pinar agressivamente o contexto do Tenant, eventos do Cliente A poderiam disparar Automações do Cliente B.

## Garantias e Solução Proposta
Conforme mapeado na Fase de Arquitetura, para garantir **Tenant A nunca consiga acessar dados do Tenant B**, é mandatório:

1. **Implementar Row-Level Security (RLS) no PostgreSQL:**
   ```sql
   ALTER TABLE workflow.process_instances ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation_policy ON workflow.process_instances
   USING (workspace_id = current_setting('app.current_workspace_id')::uuid);
   ```
2. **Contexto Forçado no Drizzle/Outbox:**
   O pool de conexão (ou transação) no Node.js deve invocar `set_config('app.current_workspace_id', context.workspaceId, true)` antes de qualquer query de negócio.

## Conclusão da Validação
No presente estágio (MVP Funcional), o isolamento está **LÓGICO** (na camada de ORM) mas **NÃO GARANTIDO PELO KERNEL DO BANCO**.
Esta lacuna deverá ser resolvida antes do Onboarding de Clientes B2B Reais.
