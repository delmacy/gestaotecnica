# Plano de Fontes para Inventário de Backlog (SB-S01-T00)

Este documento define a metodologia, as ferramentas e os critérios para a execução da task `SB-S01-T01 — Inventariar backlog e PRs existentes`.

## 1. Fontes Autoritativas e Bloqueios

Toda classificação de estado de Issue ou Pull Request deve obrigatoriamente derivar de uma fonte autoritativa do GitHub.

### Fontes Permitidas:
- **GitHub API (REST/GraphQL):** Consulta direta via ferramentas ou scripts.
- **Integração/Conector do Agente:** Acesso via ferramentas integradas (ex: `view_text_website` em URLs do GitHub).
- **Exportação Verificável:** CSVs ou JSONs exportados diretamente do GitHub com timestamp.

### Bloqueio por Ausência de Acesso:
Caso o agente não possua acesso a uma destas fontes autoritativas para um item específico, a task `SB-S01-T01` deve ser encerrada como `blocked`. É expressamente proibido inferir estados a partir de nomes de branches, prefixos ou histórico Git local.

## 2. Metodologia de Verificação

### Estados do GitHub
- **Issues:** O estado (`open` ou `closed`) deve vir do GitHub.
- **Pull Requests:** O estado real (`open`, `merged` ou `closed-unmerged`) deve ser verificado na interface ou API do GitHub.

### Verificação na Branch Main (Delivery State)
A presença da entrega na branch `main` deve ser verificada de forma independente do estado do PR:
1. **Ancestralidade:** O comando `git merge-base --is-ancestor <HEAD_SHA> origin/main` ajuda a verificar se os commits da branch estão integrados.
2. **Tratamento de Squash/Rebase:** Em casos de squash ou rebase, o SHA original da branch não constará no histórico da `main`. Nestes casos, a verificação deve ser feita por:
   - Presença de arquivos específicos.
   - Existência de um commit na `main` que mencione o ID do PR ou da Issue.
   - Comparação de conteúdo (`git diff`).

**Nota:** A ancestralidade de commit, por si só, não prova o merge de um PR específico, apenas a presença da árvore de diretórios. O vínculo PR↔Merge SHA é obrigatório.

## 3. Critérios de Análise

### Consultas Autoritativas Obrigatórias:
- Listagem de PRs abertos e mergeados recentemente (últimos 90 dias).
- Listagem de Issues abertas vinculadas ao roadmap.
- Vínculo explícito entre Issue e PR (através de "Linked issues" ou metadados).
- URLs canônicas de cada artefato.

### Itens de Documentação:
- Verificação de documentos em `docs/product-roadmap/**`.
- Prova de que um documento foi marcado como `superseded` (ex: link explícito no cabeçalho para o novo documento).

### Regras de Exclusão:
Devem ser excluídos e listados no resumo final:
- Branches pessoais de teste sem PR.
- Commits de correção de ambiente sem impacto funcional.
- Itens duplicados (indicar o ID original).

## 4. Contagens Obrigatórias
O inventário final deve totalizar:
- Total de Issues Abertas.
- Total de Issues Fechadas relacionadas a trabalho ativo.
- Total de PRs Abertos.
- Total de PRs Mergeados.
- Total de PRs `closed-unmerged`.
- Total de Documentos analisados.
- Itens marcados como `investigar`.

## 5. Evidência de Auditoria
Cada entrada deve conter o link autoritativo ou o resultado do comando de comparação que prova a integração na `main`.
