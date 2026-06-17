# Process Definition Envelope

Este documento descreve o envelope canônico para definições de processos versionados no sistema.

## Estrutura do Envelope

O envelope versionado (`ProcessVersion`) consolida metadados de versão com o grafo do processo (nós e arestas) dentro de um campo `definition`.

### Modelo de Dados (ProcessVersion)

```ts
{
  id: string; // UUID
  workspaceId: string; // UUID
  processDefinitionId: string; // UUID
  version: number; // Inteiro >= 1
  status: "draft" | "published" | "archived";
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
  createdById: string;
  definition: {
    schemaVersion: string;
    nodes: ProcessNode[];
    edges: ProcessEdge[];
  };
  publishedAt?: string;
  publishedById?: string;
  changeSummary?: string;
  metadata?: Record<string, unknown>;
}
```

### Composição (ProcessDefinitionEnvelope)

Para operações que requerem a definição base junto com a versão específica:

```ts
{
  definition: ProcessDefinition;
  version: ProcessVersion;
}
```

## Regras de Validação

O envelope implementa validações locais e determinísticas para garantir a integridade estrutural do grafo dentro de `version.definition`:

1.  **IDs Únicos**: Cada nó dentro de `nodes` deve possuir um `id` único.
2.  **IDs Únicos de Arestas**: Cada aresta dentro de `edges` deve possuir um `id` único.
3.  **Integridade de Referência**:
    *   `edge.sourceNodeId` deve referenciar um `id` existente no array `nodes`.
    *   `edge.targetNodeId` deve referenciar um `id` existente no array `nodes`.
4.  **Imutabilidade**: Os objetos resultantes do parse são congelados rasamente (`Object.freeze`).
5.  **Campos Desconhecidos**: O schema é estrito e rejeita propriedades não mapeadas.

## Referências de Contrato

*   `ProcessDefinitionSchema`: Metadados estáveis do processo.
*   `ProcessVersionSchema`: Envelope versionado contendo o grafo.
*   `ProcessNodeSchema`: Definição de unidade de execução/estado.
*   `ProcessEdgeSchema`: Definição de transição entre nós.
