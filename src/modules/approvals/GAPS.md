# Gaps and Dependencies: Approval Workflow Module

## APPROVAL_DATABASE_PROVISIONING
O uso da tabela `builder.process_candidates` como persistência para o módulo de aprovações é estritamente **transitório**.

**Plano de Migração:**
1. Criar schema `approvals` no Postgres.
2. Tabela `approvals.requests` para o estado principal.
3. Tabela `approvals.decisions` para registro detalhado das decisões (se necessário além dos eventos).
4. Migrar dados onde `origin = 'approval'`.

## Gaps de Registro (Registro Manual Necessário)
- **Side Effects de OS:** A atualização direta do status da Ordem de Serviço (`approved`/`open`) dentro da kernel action de aprovação é um gap arquitetural mantido para retrocompatibilidade. No futuro, isso deve ser substituído por um Flow que consome o evento `approval.approved`.

## Gaps de Funcionalidade
- **Múltiplos Aprovadores:** Suporta apenas um nível de aprovação.
- **Hierarquias de Alçada:** Não valida valores monetários ou alçadas de decisão baseadas em perfis.
- **Notificações:** O envio de e-mails ou alertas para aprovadores depende da implementação de flows de integração.
- **Cancelamento:** A ação de `cancel` na UI ainda não foi implementada, embora o estado exista no contrato.

## Tipos de Objeto Validáveis
Atualmente o módulo consegue validar a existência e isolamento dos seguintes tipos:
- `service_order`
- `work_item`
- `asset`
- `document`
Outros tipos serão rejeitados até que um resolver seja adicionado em `validateSubject`.
