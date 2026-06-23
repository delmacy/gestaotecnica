# GitHub Project Sync CI Operational Contract

Este documento descreve o contrato operacional e as diretrizes de sincronização entre as alterações do código no repositório de Gestão Técnica (`delmacy/gestaotecnica`) e o projeto associado no GitHub Projects V2.

## Detalhes do Projeto

- **Project Name:** System Builder — Engineering Control Center
- **Project ID:** PVT_kwHOAZkyiM4Ba85n
- **Project URL:** https://github.com/users/delmacy/projects/5
- **Owner:** delmacy

## Campos Utilizados

A configuração no Project inclui os seguintes tipos de campos, que devem ser usados como referência nas regras de CI e no envio de evidências:

- **SINGLE_SELECT:** Status, Module, Work Type, Priority, Phase, Architecture Layer, Workspace, Agent, Risk, Review Status, CI Status.
- **TEXT:** Package ID, Dependency, Base SHA, Head SHA, Notes.
- **NUMBER:** PR Number.
- **DATE:** Last Audit.

## Regras e Fluxo de Atualização (Sincronização)

1. **Uso de IDs Técnicos:**
   O GitHub Projects GraphQL API requer o uso de metadados técnicos de IDs (`projectId`, `itemId`, `fieldId`, `optionId`) e chaves tipadas (`text`, `number`, `date`, `singleSelectOptionId`) para mutações. É **expressamente proibido** inserir valores textuais de forma direta em campos baseados em escolhas, sem utilizar a formatação apropriada.

2. **Evidência sobre Operação:**
   As atualizações no Project V2 (ex.: mudanças de fase, adição de PRs) devem sempre preceder de uma validação e resultar em um recípto de alteração ("Receipt") verificável. Não forje dados. Qualquer mudança tem de ter o suporte na evidência operacional de workflows e execuções no Git.

3. **Restrições Ambientais e Sincronização via GitHub Actions:**
   As chamadas ao Project Sync deveriam ocorrer via Actions como `project-sync.yml` ou `contracts-validation.yml`.

   *Observação/Bloqueio:* A API não suporta alteração do campo descritivo `description` com a interface regular; utilize `shortDescription` no GraphQL. Além disso, a criação/atualização de opções `SINGLE_SELECT` em projetos V2 exige de forma obrigatória as chaves de `color` e `description`. Views não são suportadas para edição e não são controladas por Action no momento.

## Diretrizes de CI para Project Sync

Sempre que a sincronização for disparada (ex.: aprovação de um pacote de capacidades):
1. **Validar Dados e Tipos:** A CI usará a ID do Project.
2. **Obter IDs em tempo de execução:** A Action procurará a configuração de IDs por consultas GraphQL antes de enviar a atualização `updateProjectV2ItemFieldValue`.
3. **Receipts (Real):** CI deverá registar o Dry Run, falha ou sucesso como evidência da transição se não for bloqueado.
