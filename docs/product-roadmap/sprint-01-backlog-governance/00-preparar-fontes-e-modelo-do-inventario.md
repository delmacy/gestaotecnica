# SB-S01-T00 — Preparar fontes e modelo verificável do inventário

## Tipo
Planejamento preparatório.

## Estado inicial
`ready`

## Objetivo
Preparar a base verificável para a futura `SB-S01-T01`, eliminando interpretações livres sobre quais fontes consultar, quais campos registrar e como comprovar o estado real de issues, PRs, branches e documentos.

## Por que esta task existe
A primeira tentativa da `SB-S01-T01` foi encerrada sem merge porque o inventário foi produzido a partir de nomes de branches e poucos documentos, sem cobertura suficiente de issues, PRs, estados de merge, SHAs, URLs e evidências. A T00 deve criar o contrato operacional e o template que a T01 consumirá.

## Resultado esperado
Criar exclusivamente os dois arquivos abaixo:

1. `docs/product-roadmap/sprint-01-backlog-governance/INVENTORY_SOURCE_PLAN.md`
2. `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY_TEMPLATE.md`

## Entrega 1 — INVENTORY_SOURCE_PLAN.md
O plano deve definir:

- consultas necessárias para issues abertas;
- consultas necessárias para PRs abertos;
- consultas para PRs fechados e mergeados;
- como distinguir `closed-unmerged` de `merged`;
- como verificar head SHA, base SHA e merge SHA;
- como confirmar se uma entrega existe na `main`;
- como listar documentos de roadmap, board, contrato e decisão;
- como tratar branches sem PR;
- como registrar itens sem evidência suficiente;
- período mínimo de análise dos PRs recentes;
- critérios de inclusão e exclusão;
- contagens obrigatórias por tipo de fonte;
- formato das evidências.

## Entrega 2 — BACKLOG_INVENTORY_TEMPLATE.md
O template deve conter uma tabela com, no mínimo, as colunas:

- `origin_id`
- `artifact_type`
- `title`
- `url_or_path`
- `github_state`
- `delivery_state`
- `base_sha`
- `head_sha`
- `merge_sha`
- `domain_or_capability`
- `claimed_delivery`
- `verified_delivery`
- `duplicate_of`
- `superseded_by`
- `risk`
- `recommendation`
- `evidence`
- `notes`

Também deve incluir:

- legenda dos estados permitidos;
- exemplo de PR mergeado;
- exemplo de PR fechado sem merge;
- exemplo de issue aberta;
- exemplo de branch sem PR;
- exemplo de documento legado;
- exemplo de item marcado como `investigar`.

## Dependências
Nenhuma.

## Diretórios permitidos

- `docs/product-roadmap/sprint-01-backlog-governance/INVENTORY_SOURCE_PLAN.md`
- `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY_TEMPLATE.md`

## Diretórios proibidos

- `src/**`
- `tests/**`
- `scripts/**`
- `.github/**`
- `package.json`
- `package-lock.json`
- qualquer arquivo fora dos dois autorizados.

## Regras obrigatórias

1. Não executar ainda o inventário real.
2. Não alterar issues, PRs, labels, branches ou estados externos.
3. Não mapear artefatos para tasks nesta etapa.
4. Não inferir estados a partir de nomes de branches.
5. Não declarar itens como superseded sem evidência.
6. Toda regra deve ser verificável por GitHub ou por arquivo existente na `main`.
7. O plano deve ser suficientemente claro para que outro agente execute a T01 sem novas perguntas.

## Critérios de aceite

- as fontes obrigatórias estão explicitamente listadas;
- os métodos de verificação de estado e merge estão definidos;
- os critérios de inclusão e exclusão estão documentados;
- o template contém todas as colunas obrigatórias;
- existem exemplos para os seis cenários exigidos;
- nenhum inventário real foi preenchido;
- o diff contém somente os dois arquivos autorizados.

## Evidências obrigatórias no PR

- Task ID `SB-S01-T00`;
- base SHA;
- head SHA;
- arquivos alterados;
- `git status --short`;
- `git diff --name-only origin/main...HEAD`;
- confirmação de que nenhum estado externo foi alterado;
- confirmação de que a T01 não foi executada nesta branch.

## Rollback
Reverter os dois arquivos documentais criados.

## Prompt Jules
Busque a task `SB-S01-T00` em `docs/product-roadmap/sprint-01-backlog-governance/00-preparar-fontes-e-modelo-do-inventario.md`, execute somente a preparação das fontes e do template, em nova branch criada a partir da `main`, e publique um PR isolado sem merge automático.