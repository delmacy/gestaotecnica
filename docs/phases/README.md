# Fases e sprints

Cada unidade executável do projeto possui uma pasta própria. Fase, sprint, trilha UX e piloto usam o mesmo contrato documental.

## Identificadores

| Prefixo | Uso | Exemplo |
|---|---|---|
| `Fnn` | fase principal da plataforma | `F21-platform-hardening` |
| `UX-NAV-nn` | sprint de experiência e navegação | `UX-NAV-04-builder-identity` |
| `ST-Snn` | sprint do piloto System Trading | `ST-S01-system-trading-pilot` |
| outro prefixo estável | trilha especializada aprovada | deve constar em `current/ROADMAP.md` |

## Conteúdo obrigatório

### `README.md`

- objetivo;
- resultado de produto esperado;
- escopo incluído e excluído;
- dependências e gates;
- definição de pronto;
- documentos de referência.

### `TASKS.md`

- ID estável;
- título;
- tipo;
- dependências;
- estado documental;
- critérios de aceite resumidos;
- link para issue/PR quando existir.

### `PROGRESS.md`

- estado real da fase;
- task atual;
- registro de implementação, PR, merge e validação;
- bloqueios;
- próximos passos;
- links para evidências.

### `DECISIONS.md`

Opcional. Usado apenas para decisões exclusivas da fase. Decisões globais pertencem à arquitetura ou ao ADR correspondente.

### `evidence/`

Contém evidências consolidadas, não dumps completos de execução. Logs brutos de agentes podem permanecer temporariamente em `docs/agent-runs/`, mas devem ser referenciados pelo `PROGRESS.md`.

## Estados de task

```text
planned → ready → in_progress → review → merged → validated → closed
                    ↘ blocked
planned/ready/review → superseded
```

`merged` não significa `validated`.

## Propriedade

- Uma task pertence a uma única pasta de fase.
- Uma task não pode existir simultaneamente em board de domínio e board global.
- Gaps encontrados por uma fase devem virar novas tasks na mesma fase ou ser explicitamente transferidos para outra fase.
- Toda transferência registra origem, destino e motivo.

## Atualização mínima por PR

Um PR funcional deve atualizar:

1. a linha da task em `TASKS.md`, quando o estado mudar;
2. o registro correspondente em `PROGRESS.md`;
3. o `current/STATUS.md` apenas quando o estado da fase mudar.
