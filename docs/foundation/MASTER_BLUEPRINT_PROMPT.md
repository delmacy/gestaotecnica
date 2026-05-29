# Master Blueprint Prompt

Use estes dois prompts juntos em qualquer trabalho de implementacao do System
Builder.

## Prompt 1: Principios e Filosofia

Voce esta trabalhando no desenvolvimento do System Builder.

Antes de gerar codigo, banco de dados, telas ou arquitetura, entenda a filosofia
do projeto.

O System Builder nao e um ERP, nao e apenas um BPM, nao e um gerador de CRUDs e
nao e somente uma ferramenta de automacao.

O System Builder e uma plataforma de modelagem operacional empresarial orientada
a capacidades e processos.

Seu objetivo e permitir que organizacoes representem, executem, rastreiem e
evoluam seus protocolos digitais de forma fiel a sua realidade operacional.

A tecnologia deve adaptar-se a operacao. A operacao nao deve adaptar-se a
tecnologia.

Toda modelagem deve seguir esta ordem:

1. Compreender.
2. Espelhar.
3. Estabilizar.
4. Medir.
5. Melhorar.
6. Automatizar.

Nao automatize processos nao compreendidos. Nao otimize processos que ainda nao
foram representados corretamente.

Ao criar qualquer componente, responda:

1. Qual capacidade organizacional ele representa?
2. Qual processo ele suporta?
3. Qual resultado operacional ele produz?
4. Como sera rastreado?
5. Como podera evoluir futuramente?
6. Como se integra ao restante do ecossistema?

## Prompt 2: Infraestrutura e Implementacao

Voce esta trabalhando na implementacao tecnica do System Builder.

A arquitetura deve separar claramente:

1. Plataforma System Builder.
2. Projeto ou cliente construido sobre a plataforma.
3. Ambientes de desenvolvimento, homologacao e producao.
4. Dados estruturais da plataforma.
5. Dados operacionais dos clientes.

System Builder e a fabrica.

O cliente, blueprint ou deployment aplicado e produto da fabrica.

Nunca misture indevidamente dados internos da plataforma com dados vivos de um
cliente.

## Bancos recomendados

Desenvolvimento:

```text
system_builder_dev
gestao_tecnica_dev
```

Producao futura:

```text
system_builder_prod
gestao_tecnica_prod
```

Multi-cliente futuro:

```text
system_builder_prod
tenant_cliente_a
tenant_cliente_b
tenant_cliente_c
```

Ou um runtime multi-tenant:

```text
system_builder_prod
system_builder_runtime_prod
```

Nesse caso, `workspace_id` e obrigatorio em todas as tabelas operacionais.

## Responsabilidade dos bancos

Banco do System Builder:

- registry de modulos;
- blueprints;
- versoes de blueprints;
- templates;
- metamodelo global;
- catalogo de actions;
- catalogo de integracoes;
- configuracoes globais;
- marketplace futuro;
- documentacao estrutural;
- versoes da engine.

Banco do cliente ou runtime:

- usuarios do workspace;
- processos ativos;
- instancias de processos;
- payloads;
- documentos;
- eventos;
- auditoria;
- permissoes;
- dados operacionais;
- integracoes configuradas;
- historico de execucao.

## Schemas recomendados

No banco do System Builder:

```text
builder
blueprints
registry
modules
integrations
audit
```

No banco do cliente/runtime:

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

## Regra de dados

PostgreSQL e a fonte da verdade.

MinIO armazena arquivos.

PostgreSQL governa metadados, vinculos, permissoes e rastreabilidade.

MinIO guarda bytes.

Relacional no esqueleto. JSONB nas articulacoes.
