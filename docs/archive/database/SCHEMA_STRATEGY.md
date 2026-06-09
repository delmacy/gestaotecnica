# Estratégia de Schemas

## Banco unificado: `tec_db`

Para desenvolvimento, testes e o estágio atual do produto, Platform e Runtime
compartilham o banco `tec_db`, mantendo a separação lógica por schemas. Isso
permite transações atômicas entre Process Candidates e Workflow Definitions sem
eliminar as fronteiras arquiteturais.

| Schema | Responsabilidade | Descrição |
| :--- | :--- | :--- |
| `builder` | Platform | Configurações globais e Process Candidates. |
| `registry` | Platform | Catálogo de módulos, capacidades e versões. |
| `blueprints` | Platform | Definições de pacotes reutilizáveis. |
| `identity` | Runtime | Usuários, autenticação, perfis e papéis. |
| `workspace` | Runtime | Configurações do ambiente e membros. |
| `workflow` | Runtime | Definições, versões, instâncias, transições e eventos. |
| `documents` | Runtime | Metadados de documentos, versões e vínculos. |
| `storage` | Runtime | Metadados de objetos armazenados. |
| `notifications` | Runtime | Fila e histórico de notificações. |

As conexões `DATABASE_URL`, `PLATFORM_DATABASE_URL` e `RUNTIME_DATABASE_URL`
devem apontar para `tec_db` neste modo unificado.

## Regra de Modelagem

- **metadata** deve ser relacional.
- **payload** de dados dinâmicos deve ser `JSONB`.
- O `workspace_id` é obrigatório nas tabelas operacionais.
- A separação por schemas continua sendo uma fronteira arquitetural, mesmo
  quando uma transação precisa atravessar Platform e Runtime.
