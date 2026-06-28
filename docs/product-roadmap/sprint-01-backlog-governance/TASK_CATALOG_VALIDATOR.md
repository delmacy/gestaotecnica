# Validador do Catálogo de Tasks

O validador do catálogo de tasks é uma ferramenta determinística e read-only projetada para garantir a integridade e a consistência do roadmap do System Builder.

## Localização

- Script: `scripts/validate-task-catalog.mjs`
- Testes: `scripts/__tests__/validate-task-catalog.test.mjs`

## Uso

Para executar o validador contra os arquivos padrão:

```bash
node scripts/validate-task-catalog.mjs
```

Para validar arquivos customizados:

```bash
node scripts/validate-task-catalog.mjs \
  --index docs/product-roadmap/TASK_INDEX.md \
  --map docs/product-roadmap/sprint-01-backlog-governance/NORMALIZED_TASK_MAP.md
```

## Regras de Validação

O validador verifica:

- **IDs Duplicados:** Garante que cada ID oficial (SB-Sxx-Txx) apareça apenas uma vez no `TASK_INDEX.md`.
- **Formato de ID:** Valida se os IDs seguem o padrão oficial `^SB-S\d{2}-T\d{2}$`.
- **Referências Inexistentes:** Verifica se predecessores, sucessores ou IDs normalizados apontam para tasks que existem no índice.
- **Ciclos de Dependência:** Detecta ciclos no grafo de dependências entre as tasks.
- **Simetria:** Emite um warning se uma dependência A -> B for declarada mas não houver a recíproca B <- A correspondente.
- **Fluxo da Sprint 01:** Valida a ordem obrigatória das tasks da Sprint 01 (T00 -> T01 -> T02/T03 -> T04 -> T05).
- **Campos Obrigatórios:** Garante a presença de todos os campos críticos no índice e no mapa normalizado.
- **Estados Permitidos:** Valida se `normalized_state` pertence à lista autorizada.
- **Owners Lógicos:** Valida se `logical_owner` pertence à lista autorizada de domínios.
- **Existência de Arquivos:** Verifica se caminhos locais referenciados no catálogo existem no repositório.

## Códigos de Erro

- `DUPLICATE_ID`: ID oficial duplicado no índice.
- `INVALID_ID_FORMAT`: ID fora do padrão `SB-Sxx-Txx`.
- `MISSING_REFERENCE`: Referência a um ID que não existe no índice.
- `DEPENDENCY_CYCLE`: Ciclo de dependência detectado.
- `ASYMMETRIC_DEPENDENCY`: (Warning) Divergência entre predecessor e sucessor.
- `MISSING_REQUIRED_FIELD`: Campo obrigatório ausente.
- `INVALID_STATE`: Estado normalizado não permitido.
- `INVALID_OWNER`: Owner lógico não permitido.
- `MISSING_FILE`: (Warning) Caminho local não encontrado no repositório.
- `INVALID_CANDIDATE_ID_USAGE`: Uso de ID oficial no campo de candidate_id.
- `INVALID_SPRINT_01_FLOW`: Violação da ordem obrigatória da Sprint 01.

## Relatório de Execução Atual

Data da verificação: 2026-06-28

### Erros Reais Encontrados

| Código | Arquivo | Item | Mensagem | Evidência |
|---|---|---|---|---|
| MISSING_REFERENCE | NORMALIZED_TASK_MAP.md | Line 3 | Normalized ID "SB-S01-T00" refers to a task not found in TASK_INDEX | SB-S01-T00 |
| MISSING_REFERENCE | NORMALIZED_TASK_MAP.md | SB-S01-T01 | Predecessor "SB-S01-T00" does not exist | SB-S01-T00 |

**Nota:** Estes erros ocorrem porque a task `SB-S01-T00` (preparatória) não foi incluída no `TASK_INDEX.md` original, embora seja usada como predecessor no `NORMALIZED_TASK_MAP.md`. A correção destes itens pertence à task **SB-S01-T04**.

### Warnings

Nenhum warning encontrado.

## Limitações

- O validador não verifica o conteúdo semântico dos títulos ou razões de normalização.
- URLs externas são validadas apenas sintaticamente quanto ao prefixo `http`.
- O validador é estritamente read-only e não altera os documentos originais.
