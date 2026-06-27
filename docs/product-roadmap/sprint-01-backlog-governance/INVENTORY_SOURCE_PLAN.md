# Plano de Fontes para Inventário de Backlog (SB-S01-T00)

Este documento define a metodologia, as ferramentas e os critérios para a execução da task `SB-S01-T01 — Inventariar backlog e PRs existentes`.

## 1. Ferramentas e Limitações

- **Git CLI:** Ferramenta primária para análise de histórico, branches e SHAs.
- **Leitura de Arquivos:** Análise de `docs/product-roadmap/**` e outros documentos na `main`.
- **Ausência de GH CLI:** O comando `gh` não está disponível. Toda informação de estado do GitHub (PRs, Issues) deve ser inferida através do histórico do Git e mensagens de commit, ou assumida como `investigar` se não houver evidência local.

## 2. Metodologia de Consulta

### Issues e Tasks Legais
- **Fonte:** `docs/product-roadmap/TASK_INDEX.md`, `docs/product-roadmap/README.md` e issues mencionadas em mensagens de commit.
- **Comando:** `git log --all --grep="SB-S01" --grep="SB-" --grep="issue"`
- **Critério:** Listar todas as tasks planejadas no novo roadmap e issues legadas que ainda possuem trabalho pendente.

### Pull Requests
- **Fonte:** Histórico da branch `main` e branches remotas.
- **Comando para listar PRs mergeados:** `git log origin/main --merges --oneline --since="90 days ago"`
- **Comando para listar PRs abertos/fechados (via branches):** `git branch -r` (analisar prefixos `feat/`, `fix/`, `task/`).

### Verificação de Estado de Entrega (Delivery State)
Para cada PR ou branch identificado:
1. **Identificar o Head SHA:** O commit mais recente da branch.
2. **Verificar Ancestralidade:**
   - Comando: `git merge-base --is-ancestor <HEAD_SHA> origin/main`
   - Se retornar `0`: Estado é `merged`.
   - Se não for ancestral, mas a branch remota ainda existir: Estado é `open` (ou `closed-unmerged` se houver evidência de fechamento sem merge).
   - Na dúvida entre `closed-unmerged` e `open` sem `gh CLI`, marcar como `investigar`.

### Verificação de SHAs
- **Base SHA:** O ponto de divergência da branch original (`git merge-base branch origin/main`).
- **Head SHA:** O último commit da branch analisada.
- **Merge SHA:** O hash do merge commit na `main` (se aplicável).

## 3. Critérios de Inclusão e Exclusão

### Incluir:
- Todos os PRs abertos.
- PRs mergeados ou fechados nos últimos 90 dias.
- Issues abertas ou fechadas recentemente relacionadas a código ainda não integrado.
- Todos os documentos em `docs/product-roadmap/**`.
- Branches remotas sem PR associado mas com commits recentes (últimos 30 dias).

### Excluir:
- Commits diretos na `main` sem associação a PR (salvo se forem correções críticas documentadas).
- Branches de teste/experimento pessoal sem impacto no produto.

## 4. Contagens Obrigatórias
O inventário final deve totalizar:
- [ ] Total de Issues (Abertas/Fechadas).
- [ ] Total de PRs (Abertos/Mergeados/Closed-unmerged).
- [ ] Total de Branches sem PR.
- [ ] Total de Documentos analisados.
- [ ] Itens marcados como `investigar`.

## 5. Formato das Evidências
Cada entrada no inventário deve referenciar:
- Caminho do arquivo ou SHA do commit.
- Resultado do comando de verificação (ex: `is-ancestor` return code).
- Data da última atualização.
