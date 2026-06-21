# Project Sync CI Contract

## Objetivo
Estabelecer o contrato operacional do GitHub Project no fluxo de CI/CD para o projeto Gestão Técnica e Plataforma, separando intenção, execução e evidência conforme o modelo operacional do repositório.

## Issues Associadas
- Referencia parcial #239 (Project Sync CI)
- Referencia parcial #240 (Architecture Rules em CI)
- Referencia parcial #246 (Project Setup Report)

## O Contrato

O Project V2, configurado conforme relatórios prévios (Issue #246), atua apenas como suporte à visibilidade. As seguintes regras regem a automação:

1. **Ação de Sync**: Scripts de sync devem atualizar os cards usando apenas os IDs técnicos estruturais (`projectId`, `itemId`, `fieldId`, `optionId`), extraídos de artefatos oficiais como o config `.github/project-config.json` (que será estruturado com dados reais quando permissões estiverem garantidas). Não é permitido tentar mapear textos livres se o campo for um `singleSelectOptionId`.
2. **Evidência**: A CI deve registrar a resposta (receipt) do GraphQL do GitHub, seja sucesso ou erro. Não deve forjar/hallucinar "success" se ocorreu erro. O repositório e os commits continuam sendo a fonte de verdade absoluta.
3. **Validação Arquitetural**: A CI deve incluir uma verificação local dos domínios arquiteturais (via script `check:architecture` ou equivalente), garantindo que as regras descritas no `ARCHITECTURE.md` sejam pelo menos estruturalmente validadas sem intervenção humana invisível.
4. **Bloqueios (Not Configured/Dry Run)**: Scripts de CI que não encontram tokens administrativos suficientes ou IDs técnicos válidos (ou que estejam em uma infraestrutura não provisionada) devem exibir estado `DRY_RUN` ou `NOT_CONFIGURED` no log e continuar. Eles **não devem** falhar o job documentalmente, respeitando a separação de ACCEPT_DELIVERY e bloqueios em infraestrutura.

## Status Real (Issue #246)
Atualmente (como documentado no relatório #246), o Sync automático está **bloqueado**. A automação não possui os IDs GraphQL verificados do Project nem os PATs necessários com escopos de admin (`project` scope) para a mutação de estado. Até que essas variáveis sejam injetadas ou informadas, os scripts de Sync atuarão no modo *dry-run/blocked*.
