# SB-S01-T02 — Normalizar IDs, estados e dependências

## Tipo
Planejamento e modelagem de backlog.

## Estado inicial
`blocked` até a aprovação ou merge de `SB-S01-T01`.

## Objetivo de negócio
Transformar o inventário existente em uma fila única de trabalho, com IDs estáveis, estados padronizados e dependências explícitas, para que humanos e agentes encontrem a mesma task sem ambiguidade.

## Contexto atual
O roadmap inicial possui 50 IDs, mas issues e documentos anteriores ainda usam títulos, números e nomenclaturas próprias. Esta task cria a ponte entre o legado e o novo catálogo sem apagar histórico.

## Resultado esperado
Criar `BACKLOG_MAPPING.md` contendo:

- item de origem;
- ID canônico `SB-*` correspondente;
- estado normalizado;
- sprint e tipo;
- domínio;
- dependências obrigatórias;
- tasks paralelas permitidas;
- conflitos de diretório;
- substitui/substituído por;
- justificativa do mapeamento;
- gaps que exigem task adicional.

Atualizar `TASK_INDEX.md` somente quando o inventário comprovar erro, lacuna ou duplicidade. Qualquer mudança deve preservar os 50 IDs existentes ou registrar formalmente a substituição.

## Dependências

- `SB-S01-T01` aprovada ou mergeada;
- `BACKLOG_INVENTORY.md` disponível na branch base utilizada.

## Pode executar em paralelo com
`SB-S01-T03`, desde que ambas partam do mesmo inventário aprovado e não editem o mesmo arquivo simultaneamente.

## Não pode executar em paralelo com
Tasks que alterem `TASK_INDEX.md` ou a taxonomia global de estados.

## Diretórios permitidos

- `docs/product-roadmap/TASK_INDEX.md`
- `docs/product-roadmap/sprint-01-backlog-governance/BACKLOG_MAPPING.md`
- documentação auxiliar dentro da sprint.

## Diretórios proibidos

- `src/**`
- `tests/**`
- `scripts/**`
- `.github/**`
- demais sprints, salvo links necessários e estritamente documentais.

## Decisões obrigatórias

1. Um item ativo deve possuir um único ID canônico.
2. Um ID pode referenciar múltiplos artefatos históricos, mas apenas uma task vigente.
3. PR fechado sem merge recebe `closed-unmerged`, não `merged` nem `completed`.
4. Item substituído recebe `superseded` e aponta para o sucessor.
5. Dependências devem indicar motivo: contrato, código, dados, review ou teste.
6. Paralelismo exige diretórios não sobrepostos ou contrato público estável.

## Procedimento recomendado

1. Consumir o inventário aprovado.
2. Mapear cada item para task vigente, arquivo ou estado histórico.
3. Identificar tarefas sem cobertura no catálogo.
4. Registrar dependências e conflitos.
5. Validar que não há ciclos óbvios.
6. Atualizar o índice apenas com evidência.

## Cenários obrigatórios

- issue que corresponde parcialmente a duas tasks;
- PR antigo substituído por rebuild;
- task do roadmap já concluída antes da criação do catálogo;
- documento sem owner lógico;
- item relevante sem ID canônico;
- dependência circular aparente.

## Critérios de aceite

- todo item inventariado possui destino canônico ou justificativa de arquivo;
- não existem dois IDs vigentes para o mesmo resultado;
- dependências são explícitas e justificadas;
- paralelismo e conflitos estão registrados;
- estados pertencem à taxonomia global;
- alterações no índice são mínimas e rastreáveis.

## Evidências obrigatórias no PR

- referência ao inventário utilizado;
- tabela de IDs criados, preservados, corrigidos ou superseded;
- ciclos encontrados ou confirmação de ausência;
- diff documental restrito;
- base SHA e head SHA.

## Fora de escopo

- implementar tasks mapeadas;
- alterar issues/PRs no GitHub;
- renumerar todo o roadmap por preferência estética;
- apagar histórico.

## Rollback
Reverter `BACKLOG_MAPPING.md` e qualquer ajuste comprovado em `TASK_INDEX.md`.

## Prompt Jules
Busque a task `SB-S01-T02` em `docs/product-roadmap/sprint-01-backlog-governance/02-normalizar-ids-estados-dependencias.md`, confirme que T01 está disponível e produza apenas o mapeamento canônico.