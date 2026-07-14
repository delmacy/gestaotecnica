# Context Index — System Builder

Este documento consolida os domínios do sistema de forma objetiva, conectando a governança com a implementação.

## Lista de Context Packs

*   [**Builder (`builder.md`)**](../context-packs/builder.md): Shell visual, canvas do React Flow e modelo em memória.
*   [**Workflow Definitions (`workflow-definitions.md`)**](../context-packs/workflow-definitions.md): Entidades estruturais puras em Typescript (Nodes, Edges) e persistência de dados.
*   [**Persistence (`persistence.md`)**](../context-packs/persistence.md): Estrutura de Service/Repository para definitions/versions, isolado da API.
*   [**Publication (`publication.md`)**](../context-packs/publication.md): Processo de transformar versões do Builder de Draft para Published.
*   [**Runtime (`runtime.md`)**](../context-packs/runtime.md): Fases focadas na execução: schemas de instâncias, service e a engine que coordena a execução de workflows.
*   [**DB Schemas (`db-schemas.md`)**](../context-packs/db-schemas.md): Diretrizes para `src/db/platform/schema` e `src/db/runtime/schema`, isolamento e banco de dados subjacente.
