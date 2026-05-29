# Database Strategy

## Decisao

Criar bancos separados para plataforma e runtime aplicado.

## Desenvolvimento

```text
system_builder_dev
gestao_tecnica_dev
```

## Producao futura

```text
system_builder_prod
gestao_tecnica_prod
```

## Multi-cliente futuro

Modelo com banco por tenant:

```text
system_builder_prod
tenant_cliente_a
tenant_cliente_b
tenant_cliente_c
```

Modelo com runtime multi-tenant:

```text
system_builder_prod
system_builder_runtime_prod
```

No runtime multi-tenant, `workspace_id` e obrigatorio em todas as tabelas
operacionais e nenhuma consulta operacional pode ocorrer sem filtro de
workspace.

## Banco System Builder

Guarda a plataforma, nao a operacao especifica do cliente:

- registry de modulos;
- capacidades;
- blueprints;
- versoes de blueprints;
- templates;
- metamodelo global;
- catalogo de actions;
- catalogo de integracoes;
- configuracoes globais;
- marketplace;
- versoes da engine;
- auditoria estrutural.

Schemas recomendados:

```text
builder
blueprints
registry
modules
integrations
audit
```

## Banco cliente/runtime

Guarda a operacao real:

- usuarios;
- workspaces;
- processos ativos;
- instancias;
- payloads;
- documentos;
- eventos;
- auditoria;
- permissoes;
- dados operacionais;
- integracoes configuradas;
- historico de execucao.

Schemas recomendados:

```text
identity
workspace
workflow
documents
storage
audit
integrations
notifications
```

## Regra de modelagem

PostgreSQL e a fonte da verdade.

MinIO guarda arquivos.

Use tabelas relacionais para o esqueleto operacional e JSONB para payloads,
campos dinamicos, regras condicionais, layouts, snapshots e payloads externos.

JSONB nao substitui modelagem.
