# System Builder - Actions and Projects Operating Model

Este documento define o modelo operacional para o uso de GitHub Actions e GitHub Projects no escopo do System Builder. O objetivo principal é garantir que **intenção, execução e evidência** permaneçam conceitualmente e tecnicamente separadas.

## 1. O Papel Operacional de Actions, Checks e Projects

GitHub Actions, checks de CI/CD e o GitHub Projects atuam puramente como **suporte operacional e ferramentas de visibilidade**.
Eles **não** são a fonte da verdade sobre o estado do código ou sobre a completude de uma entrega. A verdadeira fonte da verdade é sempre o repositório Git, seus commits, Pull Requests (PRs) integrados e os receipts de deploy e validação (artefatos/arquivos de evidência).

## 2. Leitura de Actions e Checks pelo Tester

Quando o papel de Tester (ou agente que executa validações) atua:
- O Tester **deve** monitorar os checks e workflows de Actions associados a um PR antes de atestar que uma entrega foi concluída com sucesso.
- O Tester lê as execuções de Actions como primeira linha de validação de que os testes automatizados, build e lint passaram.

## 3. Bloqueios por Inacessibilidade de Checks

Caso os checks do GitHub (ou a aba de Actions) não estejam acessíveis, estejam inoperantes ou retornem status desconhecidos temporários:
- O Tester **deve** registrar explicitamente o bloqueio na Issue ou PR correspondente.
- A indisponibilidade de checks **não é um bloqueador absoluto** de ACCEPT_DELIVERY caso a entrega seja estritamente documental ou de escopo que possa ser verificado de outra forma.
- No entanto, a existência de CI legível e verde (com sucesso atestado) é um **requisito inegociável para MERGE_READY ou MERGE_PR**, quando aplicável ao tipo de entrega.

## 4. Campos Mínimos Exigidos no Project

Para qualquer item (Issue/Task/PR) acompanhado no GitHub Projects (v2), os seguintes campos são obrigatórios:

- **Task/Issue Link:** O identificador que liga o card ao artefato principal de trabalho.
- **PR:** O link direto para o Pull Request que implementa a task.
- **Status:** O estado do fluxo (ex: Todo, In Progress, Code Review, Done).
- **Owner (Assignee):** O responsável direto pela execução ou condução do item.
- **Blocker:** Indicador explícito caso a task esteja impedida.
- **EvidenceUrl:** Link que aponta para as evidências de validação (receipt de execução, run de CI/CD, report do Tester).

## 5. Campos Visíveis vs. IDs Técnicos do Projects V2

Ao operar as APIs GraphQL do GitHub Projects v2:
- **Campos Visíveis (UI):** O que o usuário vê (ex: "Status: Done", ou "Status: In Progress").
- **IDs Técnicos Mínimos:** O GraphQL API e a automação do Projects requerem o uso estrito de metadados técnicos, incluindo `projectId`, `itemId`, `fieldId`. Para a atribuição em si, deve-se usar o formato correto conforme o tipo: `optionId` para campos single-select, ou chaves como `text` / `number` para outros tipos de dados.
Scripts e bots **não devem** tentar injetar valores textuais diretamente em campos estruturados (enumerados) assumindo que o GitHub os resolverá sozinhos.

## 6. A Regra do Receipt Real para Updates de Project

Atualizações no GitHub Projects (como transições de estado, mudança para Done ou inserção de EvidenceUrl) requerem comprovação de execução:
- **Ordem de Execução:** A mutação na API do GitHub Projects ocorre primeiro. No entanto, o **sucesso** da atualização só pode ser declarado *após* a obtenção de um receipt real retornado pela API ou por uma Action que processe o update.
- É **expressamente proibido** forjar, assumir, "fingir" ou hallucinar o sucesso de um update no Project sem obter o receipt subsequente gerado pelo sistema.

## 7. Separação de ACCEPT_DELIVERY e MERGE_PR

As fases de aprovação final são distintas:
- **ACCEPT_DELIVERY:** O momento em que o código foi revisado, as regras de negócio satisfeitas, os testes estão passando (com receipts válidos) e o Tester validou que os critérios de aceite foram atendidos. É o selo de "pronto e validado".
- **MERGE_PR:** A operação mecânica de fundir a branch no branch de destino (`main` ou outro alvo).

Uma entrega não é "aceita" apenas porque sofreu merge, e um merge não significa validação de entrega se o ACCEPT_DELIVERY explícito não ocorreu antes (e deixou evidência rastreável).

## 8. Preservando o Repositório e PRs como Fonte de Verdade

O Project é apenas um painel de leitura consolidada.
Para evitar que o Project V2 se torne uma falsa fonte da verdade, as seguintes regras são absolutas:
- Qualquer conflito de estado entre o código/PR e o card no Project é sempre resolvido em favor do PR e do histórico Git.
- A completude de uma tarefa é medida pelos commits na branch principal e pelos receipts emitidos, não pelo fato de um card estar na coluna "Done".
- O Project é uma projeção downstream da execução; não dita a realidade upstream do Git e das Actions.
