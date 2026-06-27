# SB-S01-T01 — Inventariar backlog e PRs existentes

## Tipo
Planejamento.

## Modo
Sequencial após T00.

## Objetivo
Mapear o estado real de todas as iniciativas em andamento, PRs abertos, fechados recentes, issues e documentos de roadmap para alimentar a normalização (T02).

## Gate obrigatório

Antes de criar branch ou alterar arquivos:

1. Atualize a referência da "origin/main".
2. Confirme que a "SB-S01-T00" foi mergeada.
3. Confirme que estes arquivos existem na "origin/main":

- "docs/product-roadmap/sprint-01-backlog-governance/INVENTORY_SOURCE_PLAN.md"
- "docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY_TEMPLATE.md"
- "docs/product-roadmap/sprint-01-backlog-governance/01-inventariar-backlog-e-prs.md"

4. Leia obrigatoriamente:

- "docs/product-roadmap/README.md"
- "docs/product-roadmap/ARCHITECTURE_CONTEXT.md"
- "docs/product-roadmap/EXECUTION_RULES.md"
- "docs/product-roadmap/TASK_INDEX.md"
- "docs/product-roadmap/sprint-01-backlog-governance/CONTEXT.md"
- "docs/product-roadmap/sprint-01-backlog-governance/README.md"
- "docs/product-roadmap/sprint-01-backlog-governance/00-preparar-fontes-e-modelo-do-inventario.md"
- "docs/product-roadmap/sprint-01-backlog-governance/INVENTORY_SOURCE_PLAN.md"
- "docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY_TEMPLATE.md"
- "docs/product-roadmap/sprint-01-backlog-governance/01-inventariar-backlog-e-prs.md"

Caso qualquer arquivo esteja ausente ou a T00 não esteja mergeada:

- não crie branch;
- não use arquivos de outra branch;
- não improvise o modelo;
- encerre como "blocked";
- informe exatamente a dependência ausente.

## Branch

Crie uma nova branch a partir da "origin/main" atual:

"task/sb-s01-t01-inventariar-backlog-prs-v2"

Não reutilize:

- a branch do PR #353;
- a branch da T00;
- qualquer branch anterior da Sprint 01.

## Entrega exclusiva

Crie somente:

"docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY.md"

Use obrigatoriamente como base:

- as fontes definidas em "INVENTORY_SOURCE_PLAN.md";
- as colunas e estados definidos em "BACKLOG_INVENTORY_TEMPLATE.md".

Não simplifique nem substitua o template.

## Escopo de análise

Analise obrigatoriamente:

### Issues

- todas as issues abertas relevantes;
- issues fechadas ainda relacionadas a trabalho ativo;
- issues sem implementação comprovada;
- issues associadas a PRs;
- issues duplicadas ou substituídas.

### Pull requests

- todos os PRs abertos;
- PRs mergeados relevantes;
- PRs fechados sem merge;
- PRs recentes das Waves;
- PRs de clean rebuild;
- PRs substituídos;
- PRs documentais que alteraram roadmap, contratos ou decisões;
- PRs alegadamente concluídos cuja entrega precisa ser confirmada na "main".

### Branches

- branches com PR aberto;
- branches cujo PR foi fechado sem merge;
- branches sem PR;
- branches antigas ou aparentemente abandonadas.

O nome da branch não pode ser usado como prova de estado.

### Documentos

- "docs/product-roadmap/**";
- roadmaps ativos;
- work boards;
- planos mestres;
- contratos arquiteturais;
- decisões;
- documentos arquivados;
- documentos potencialmente substituídos.

## Regras de classificação

- PR aberto: registrar estado real "open".
- PR mergeado: registrar "merged" e o "merge_sha".
- PR fechado sem merge: registrar "closed-unmerged".
- Issue aberta: registrar "open".
- Branch sem PR: registrar como branch sem comprovação de entrega.
- Documento só pode ser "superseded" quando houver evidência explícita.
- Entrega alegada deve ficar separada da entrega verificável.
- Quando não houver evidência suficiente, usar "investigar".
- Não deduzir domínio, capability, substituto ou conclusão sem evidência.
- Não considerar branch remota como entrega integrada.
- Não considerar PR fechado como mergeado.
- A existência de código numa branch não comprova presença na "main".

## Campos obrigatórios

Cada linha deve preencher os campos previstos no template, incluindo:

- "origin_id"
- "artifact_type"
- "title"
- "url_or_path"
- "github_state"
- "delivery_state"
- "base_sha"
- "head_sha"
- "merge_sha"
- "domain_or_capability"
- "claimed_delivery"
- "verified_delivery"
- "duplicate_of"
- "superseded_by"
- "risk"
- "recommendation"
- "evidence"
- "notes"

Use "N/A" somente quando o campo não se aplicar. Use "investigar" quando a informação deveria existir, mas não pôde ser comprovada.

## Cobertura e contagens

Ao final do documento, inclua:

- quantidade de issues abertas analisadas;
- quantidade de issues fechadas analisadas;
- quantidade de PRs abertos analisados;
- quantidade de PRs mergeados analisados;
- quantidade de PRs "closed-unmerged" analisados;
- quantidade de branches sem PR analisadas;
- quantidade de documentos analisados;
- quantidade de itens marcados como "investigar";
- itens excluídos;
- justificativa de cada exclusão;
- limitações de acesso ou consulta.

## Verificação obrigatória

Antes do commit e antes de abrir o PR, execute:

git status --short
git diff --name-only origin/main...HEAD

O diff deve conter exclusivamente:

docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_INVENTORY.md

Caso qualquer outro arquivo apareça, remova-o antes de abrir o PR.

## Pull request

Abra um PR isolado com o título:

"SB-S01-T01 — Inventariar backlog e PRs existentes v2"

A descrição deve incluir:

- Task ID "SB-S01-T01";
- indicação de que substitui a tentativa encerrada no PR #353;
- caminho do contrato;
- PR e merge SHA da T00;
- base SHA;
- head SHA;
- quantidades por tipo de fonte;
- consultas e fontes utilizadas;
- lista de exclusões;
- quantidade de itens "investigar";
- confirmação de que nenhum estado externo foi alterado;
- confirmação de que o diff contém somente "BACKLOG_INVENTORY.md";
- resultado de "git status --short";
- resultado de "git diff --name-only origin/main...HEAD";
- limitações encontradas.
