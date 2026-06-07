# Implementação da Estratégia de Banco de Dados

Este documento registra como a estratégia de banco de dados e schemas foi implementada no repositório.

## 1. Conexões de Banco de Dados (`src/db/index.ts`)

Foram implementadas duas conexões principais para suportar a separação entre plataforma e runtime:

- `platformDb`: Gerencia os dados da "Fábrica" (System Builder). Utiliza a variável `PLATFORM_DATABASE_URL`.
- `runtimeDb`: Gerencia os dados operacionais do cliente (ex: Gestão Técnica). Utiliza a variável `RUNTIME_DATABASE_URL`.

Ambas possuem fallback para `DATABASE_URL`. No modo unificado adotado para
desenvolvimento e testes, as três variáveis apontam para o mesmo banco
`tec_db`, preservando a separação por schemas e permitindo transações atômicas.

Preparação idempotente e teste de integração:

```text
npm run db:setup:unified-test
npm run test:integration
```

## 2. Organização de Schemas

As tabelas foram organizadas em Schemas do PostgreSQL para evitar colisões e separar responsabilidades.

### Platform Schemas
Localizados em `src/db/platform/schema/`:
- `registry`: Capacidades e catálogo de módulos.
- `blueprints`: Definições e versões de blueprints.

### Runtime Schemas
Localizados em `src/db/runtime/schema/`:
- `identity`: Usuários, papéis e permissões do cliente.
- `workspace`: Dados do workspace e membros.
- `workflow`: Definições de processos, estados, transições, instâncias, payloads e eventos.

## 3. Coexistência com o Legado

Para garantir que o sistema atual de "Gestão Técnica" continue funcionando:
- O schema original foi movido para `src/db/legacy/schema.ts`.
- O arquivo `src/db/schema.ts` atua como uma ponte, exportando tudo do legado.
- Nenhuma tabela do schema `public` foi removida ou alterada nesta fase.
- A migração dos dados legados para a nova ontologia será feita de forma controlada em sprints futuras.
