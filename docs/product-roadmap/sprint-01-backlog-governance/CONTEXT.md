# Contexto da Sprint 01 — Backlog e governança

## Objetivo de negócio

Transformar o histórico acumulado de issues, PRs, documentos, planos e tentativas de implementação em uma fonte única, navegável e determinística de trabalho. Ao final da sprint, o usuário deve conseguir indicar apenas um ID e um caminho para que o Jules encontre contexto, dependências, escopo e critérios de aceite sem depender do chat.

## Por que esta sprint existe

O projeto cresceu por várias frentes: Builder, runtime, módulos, persistência, eventos, Agent Work e governança. Parte desse crescimento gerou:

- issues com escopos sobrepostos;
- PRs fechados sem merge ou substituídos;
- branches contaminadas por outros módulos;
- descrições que não representavam o diff;
- documentos concorrentes sobre o mesmo domínio;
- tarefas sem dependências explícitas;
- dificuldade para um agente distinguir planejamento, desenvolvimento, review e teste.

Esta sprint não deve desenvolver funcionalidades do produto. Ela organiza a execução futura.

## Estado de entrada

- Há um roadmap inicial de 50 tasks em 10 sprints.
- Existem issues recentes relacionadas a onboarding, capabilities, Builder, integração, persistência, observabilidade e deploy.
- Existem PRs recentes de eventos, módulos e relatórios, alguns mergeados e outros fechados sem merge.
- O repositório contém roadmaps e documentação anteriores que não devem ser apagados sem classificação.

## Resultado esperado da sprint

1. Inventário verificável do backlog e histórico relevante.
2. Mapeamento de cada item existente para um único ID do novo catálogo ou estado de arquivo/superseded.
3. Validador automatizado do catálogo.
4. Review independente sobre duplicidades e inconsistências.
5. Prova prática de que o Jules consegue executar por ID e caminho.

## Decisões obrigatórias

- O GitHub real é a fonte de verdade para estado de issues e PRs.
- Um PR fechado sem merge não conta como entrega integrada.
- Uma branch local ou relatório sem commit remoto não conta como entrega verificável.
- Não excluir histórico; classificar, arquivar ou marcar como superseded.
- Não reabrir, fechar ou alterar issues/PRs como efeito desta sprint sem autorização explícita da task.
- Não alterar código funcional, schemas, módulos ou dependências da aplicação, exceto o script de validação previsto na T03.

## Diretórios normalmente permitidos

- `docs/product-roadmap/**`
- `docs/**` apenas para referências e relatórios da sprint
- `scripts/**` apenas para o validador da T03
- testes próprios do validador, quando necessários

## Fora de escopo

- corrigir módulos;
- implementar onboarding;
- migrar persistência;
- alterar eventos;
- executar merges;
- reorganizar fisicamente todo o diretório `docs/`;
- apagar documentos antigos;
- mudar package dependencies sem necessidade comprovada.

## Critério de encerramento da sprint

A sprint só termina quando T01–T05 estiverem aprovadas ou mergeadas, o catálogo passar no validador e uma execução piloto do Jules provar descoberta inequívoca da task.