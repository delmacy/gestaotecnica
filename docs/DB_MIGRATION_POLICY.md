# Política de Migrações de Banco

## 1. Objetivo

O projeto usa PostgreSQL com schemas lógicos para separar bounded contexts da plataforma e do runtime.

## 2. Schemas lógicos

* `public` — legado/transição;
* `workspace` — organizações e workspaces;
* `workflow` — definições, versões, eventos e instâncias de processos;
* `registry` — catálogo de capabilities, actions, events, entidades e views;
* `identity` — usuários, papéis, permissões e vínculos;
* `documents` — documentos, templates e rastreabilidade documental;
* `storage` — metadados de arquivos e objetos;
* `blueprints` — templates de processos, módulos e soluções reutilizáveis.

## 3. Regra de bootstrap

> Todo comando de geração, push ou migração de banco deve garantir antes a existência física dos schemas PostgreSQL.

Isso é necessário porque `pgSchema` no código TypeScript não garante, sozinho, que o namespace exista fisicamente no banco antes da operação do Drizzle Kit.

## 4. Uso de push vs migrations

A seguinte política temporária deve ser respeitada:

* `drizzle-kit push` pode ser usado apenas em desenvolvimento inicial;
* produção ou ambientes persistentes devem migrar gradualmente para migrations explícitas;
* alterações destrutivas devem exigir revisão manual;
* `push --force` não deve ser usado contra dados importantes sem backup.

## 5. Ordem segura de evolução

A evolução do banco deve seguir esta ordem segura:

1. criar schemas físicos;
2. criar tabelas fundacionais;
3. criar tabelas de domínio;
4. criar FKs apenas quando o domínio estiver estabilizado;
5. evitar FKs cruzadas com `public` durante a transição;
6. mover eventos para `workflow.events`;
7. reduzir dependência do legado gradualmente.

## 6. Regra sobre schema public

* `public` é considerado legado/transição;
* novas estruturas do System Builder não devem depender de `public`;
* nenhuma tabela de `public` deve ser apagada no MVP;
* integrações com `public` devem ser adaptadores temporários.

**Nota:**
- `workflow.process_definitions` armazena os metadados primários do processo.
- `workflow.process_versions` armazena as versões compiladas em JSONB dos rascunhos.
- Não existem relacionamentos Foreign Key cruzados com o esquema `public` nestas novas tabelas.

## 7. Critério de aceite

```text
npm run db:bootstrap
npm run db:generate
npm run db:push
```

devem ser capazes de rodar sem falhar por ausência de schema PostgreSQL.
