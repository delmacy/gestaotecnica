# Capability Catalog Lookup

## Responsabilidade
Este módulo fornece funções puras para consulta e filtragem do Catálogo de Capabilities da plataforma. Ele atua como uma camada de leitura sobre os dados canônicos, garantindo imutabilidade e consistência nas buscas.

## Funções

### `findCapabilityByKey(catalog: Capability[], key: string): Capability | undefined`
Retorna uma capability específica através de sua chave única. A comparação é exata e sensível a maiúsculas/minúsculas (seguindo o padrão de chaves do catálogo).

### `listCapabilitiesByDomain(catalog: Capability[], domain: CapabilityDomain): Capability[]`
Retorna todas as capabilities pertencentes a um domínio específico. Mantém a ordem original do catálogo.

### `listCapabilitiesByGroup(catalog: Capability[], group: CapabilityGroup): Capability[]`
Retorna todas as capabilities pertencentes a um grupo específico. Mantém a ordem original do catálogo.

### `hasCapability(catalog: Capability[], key: string): boolean`
Verifica a existência de uma capability pela chave, retornando um booleano.

### `searchCapabilities(catalog: Capability[], query: string): Capability[]`
Realiza uma busca textual nas capabilities.

**Campos pesquisáveis:**
- `key`
- `name`
- `description`
- `metadata.tags` (Busca segura dentro do objeto de metadados)

**Regras de busca:**
- Case-insensitive (não diferencia maiúsculas de minúsculas).
- Trim automático da consulta (remove espaços extras no início e fim).
- Consulta vazia ou composta apenas de espaços retorna uma cópia completa do catálogo.
- Pesquisa por sub-string simples (não utiliza busca aproximada ou fuzzy).

## Imutabilidade
Todas as funções são puras:
- Não alteram o array do catálogo original.
- Funções de listagem e busca retornam novos arrays.
- Não utilizam cache interno ou estado global.

## Casos de Retorno Vazio
- Filtros por domínio ou grupo sem correspondência retornam um array vazio `[]`.
- `findCapabilityByKey` retorna `undefined` se a chave não for encontrada.
- `searchCapabilities` sem resultados retorna um array vazio `[]`.

## Limites do Pacote
- Não realiza persistência de dados.
- Não valida schemas (assume que o catálogo passado já é válido).
- Não possui dependências externas além dos tipos canônicos da plataforma.
