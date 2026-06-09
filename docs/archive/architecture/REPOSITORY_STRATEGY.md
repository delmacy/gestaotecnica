# Estratégia de Repositório

O System Builder utiliza uma estratégia de organização lógica que prepara o terreno para um futuro monorepo, mantendo a simplicidade inicial em um repositório único.

## Estrutura de Pastas

### `/docs`
Toda a documentação de fundação, arquitetura, banco de dados e manuais.

### `/src/platform`
Contém o **Core** da plataforma. Lógica que não muda entre clientes.
- `actions/`: Primitivas de execução.
- `events/`: Barramento de eventos.
- `flows/`: Orquestração de processos.
- `workspace/`: Gestão de contextos.

### `/src/modules`
Módulos reutilizáveis que representam capacidades. Devem ser independentes entre si tanto quanto possível.

### `/src/adaptations`
Configurações específicas por cliente ou blueprint (ex: `secao-tecnica`). É aqui que a "Gestão Técnica" reside como uma camada de adaptação.

### `/src/db`
Divisão clara entre esquemas de banco de dados:
- `src/db/platform/`: Schemas do System Builder.
- `src/db/runtime/`: Schemas operacionais do cliente.

## Evolução para Monorepo
Quando a complexidade exigir, a estrutura evoluirá para:
- `apps/system-builder`
- `apps/gestao-tecnica`
- `packages/core`
- `packages/modules`
- `packages/blueprints`
