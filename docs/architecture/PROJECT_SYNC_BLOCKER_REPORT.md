# Project Sync CI Blocker Report

Este documento reporta a situação do sync automatizado com GitHub Projects V2 e regista por que ele encontra-se atualmente bloqueado para a adoção irrestrita no workflow padrão da Gestão Técnica.

## Motivo do Bloqueio

A implementação final do Project Sync CI (v2) não foi unida à pipeline default do repositório remoto porque:
- O ambiente não tem as permissões requeridas (ex. GraphQL API `updateProjectV2ItemFieldValue` ou manipulação livre do project board número 5 sem token autenticado via Action App válido com as scopes adequadas na Org/Usuário target).
- As restrições descritas na issue #246 (e detalhadas no `PROJECT_SYNC_CONTRACT.md`) demandam o uso correto de IDs estritos. Como a view pública da API de Projects no momento só suporta leituras simples ou requer IDs exatos, não conseguimos rodar mutações estritamente sem falhar o "Dry Run" se os IDs não tiverem sido recolhidos localmente no GitHub Action do usuário `delmacy` (que contém o project n. 5).
- A regra operacional obriga que as execuções tenham "Receipts" (evidência real) — portanto, forjar sucesso ou executar algo sem o "Dry Run" aprovado com permissões válidas estaria violando a honestidade do fluxo.

## Estado Atual da Entrega

- O script de regras de arquitetura (`validate-architecture-rules.ts`) já está implementado e a Action `architecture-check.yml` roda isolada localmente de forma estrita (`--strict`).
- O contrato de sincronização (`PROJECT_SYNC_CONTRACT.md`) documenta as diretrizes do workflow e da mutação na API de Projects (GraphQL).
- **Ação Futura:** Quando a Action de deploy for liberada com o token apropriado e os IDs puderem ser passados via Secrets, o sync deve ser anexado ao término das operações de merge.

Este registro documenta a entrega "Implementation Ready" em relação ao setup, limitando-se ao que é seguro sem as credenciais operacionais.
