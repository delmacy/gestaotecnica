# Path Ownership Policy

- Nenhum arquivo possui dois módulos donos.
- Vários módulos podem consumir um arquivo.
- Somente o owner (worker do módulo) pode alterar seu código nativo.
- Classificações válidas: `exclusive`, `shared_read_only`, `integration_owned`, `documentator_owned`, `migration_owned`, `generated`, `forbidden_parallel`.
- Tentativa de alteração fora do Ownership resulta em aborto imediato do Task Kit.
