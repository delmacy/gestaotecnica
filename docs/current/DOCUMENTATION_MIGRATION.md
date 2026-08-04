# Migração da documentação

## Objetivo

Consolidar o acompanhamento do System Builder sem quebrar referências de PRs, agentes ou documentos históricos.

## Política

A migração será feita em duas etapas:

1. **Estabelecer a nova fonte canônica** — concluída por esta reestruturação.
2. **Mover ou arquivar documentos legados gradualmente** — após atualizar links e PRs ativos.

Nenhum arquivo histórico deve ser apagado apenas por estar desatualizado. Ele deve receber destino explícito.

## Mapeamento inicial

| Origem atual | Destino canônico | Tratamento |
|---|---|---|
| `docs/archive/00-current/STATUS_DAS_FASES.md` | `docs/current/STATUS.md` e pastas em `docs/phases/` | manter como histórico; não atualizar mais |
| `docs/GLOBAL_WORK_BOARD.md` | `docs/current/STATUS.md` + `docs/phases/<ID>/TASKS.md` | congelar após migração das referências |
| `docs/product-roadmap/**` | pastas de fase correspondentes | importar tasks válidas; marcar planos substituídos como `superseded` |
| `docs/archive/phases/**` | `docs/phases/<ID>/PROGRESS.md` e `evidence/` | preservar evidências; consolidar links, não copiar logs sem necessidade |
| `docs/agent-runs/**` | evidência referenciada pela fase | manter como log bruto temporário; closeouts relevantes migram para `evidence/` |
| `docs/tasker/**` | `docs/agents/**` e catálogos de fase | preservar modelos úteis; remover boards duplicados após transição |
| `docs/ui/TASKS.md`, `docs/core/TASKS.md`, `docs/doc/TASKS.md` | fase ou backlog de domínio explicitamente identificado | nenhuma task solta sem fase proprietária |

## Documentos que continuam por domínio

Os seguintes diretórios podem continuar existindo, desde que não mantenham status global:

- `capabilities/`
- `process_mirroring/`
- `enterprise_architecture/`
- `governance/`
- `enablement/`
- `registry/`
- `ui/`
- `workflow/`
- `runtime/`
- `integrations/`

Eles descrevem contratos e conhecimento reutilizável. A execução pertence a `phases/`.

## Critério para arquivar

Um documento pode ser movido para `archive/` quando:

- seu conteúdo útil foi incorporado ao destino canônico;
- links ativos foram atualizados;
- nenhuma task aberta depende do caminho antigo; e
- o arquivo recebe cabeçalho indicando substituição e novo caminho.

## Cabeçalho de documento substituído

```markdown
> Status: superseded
> Substituído por: `docs/phases/<ID>/...`
> Preservado apenas para rastreabilidade histórica.
```

## Pendências de migração

- reconciliar o roadmap `SB-S01`–`SB-S10` com F21–F26;
- importar o detalhamento completo de UX-NAV-03 e UX-NAV-04;
- consolidar o closeout de ST-S01;
- revisar links de `README.md` e prompts de agentes;
- decidir retenção e limpeza de `docs/agent-runs/**` após consolidação das evidências.
