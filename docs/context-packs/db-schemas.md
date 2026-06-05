# Context Pack: DB Schemas

## 1. Objetivo do Domínio
Garantir o isolamento das arquiteturas e dados em diferentes schemas lógicos PostgreSQL de forma segura, possibilitando evolução gradativa (Platform vs. Runtime) sem dependência tóxica do banco legado e sem forçar atualizações massivas de Foreign Keys prematuramente.

## 2. Arquivos Principais
- `src/db/platform/schema/workflow.ts`
- `src/db/platform/schema/registry.ts`
- `src/db/runtime/schema/workspace.ts`
- `src/db/runtime/schema/identity.ts`
- `src/db/runtime/schema/workflow.ts`
- `drizzle.config.ts`

## 3. Decisões Ativas
- Dividido logicamente em Metamodelo/Platform (`platform/schema/`) e Dados Operacionais/Runtime (`runtime/schema/`).
- Uso massivo da constraint Tenant Isolation por intermédio da coluna `workspace_id`.
- Todas as execuções de mudanças de schema são planejadas cautelosamente via Scripts de Bootstrap (`src/scripts/bootstrap-schemas.ts`).
- O schema do runtime de processos (`process_instances`, etc) já existe em `src/db/runtime/schema/workflow.ts`.

## 4. Anti-Escopo
- É expressamente proibido rodar o comando `db:push` sem autorização durante o desenvolvimento iterativo, especialmente pelas instâncias das IAs sem autorização direta do dono do produto.
- Evitar ao máximo criar dependências com tabelas que vivem exclusivamente em `public`. As interações do Builder se isolam no novo schema `workflow`.
- Não criar schemas novos na Fase 17A, apenas analisar o schema `workflow` do runtime já existente.

## 5. Próximas Fases Relacionadas
- **Fase 17A**: Inspeção do schema de Workflow no `src/db/runtime/schema/workflow.ts` e criação de contratos baseados nele, validando interconexões com a base publicada de `workflow.process_versions`.