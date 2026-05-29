# Estratégia de Schemas

Dentro de cada banco de dados, utilizamos Schemas do PostgreSQL para organizar as tabelas por domínio de responsabilidade.

## Banco: `system_builder_dev` (Platform)

| Schema | Descrição |
| :--- | :--- |
| `builder` | Configurações globais da engine e da plataforma. |
| `registry` | Catálogo de módulos, capacidades e versões disponíveis. |
| `blueprints` | Definições de pacotes de processos e configurações reutilizáveis. |
| `modules` | Metadados específicos de módulos registrados. |
| `integrations` | Catálogo de plugins e conectores externos. |
| `audit` | Trilha de auditoria estrutural da plataforma. |

## Banco: `gestao_tecnica_dev` (Runtime/Client)

| Schema | Descrição |
| :--- | :--- |
| `identity` | Usuários, autenticação, perfis e papéis (roles). |
| `workspace` | Configurações do ambiente do cliente e membros. |
| `workflow` | Instâncias de processos, estados, transições e eventos. |
| `documents` | Metadados de documentos, versões e vínculos. |
| `storage` | Metadados de objetos armazenados (MinIO). |
| `notifications` | Fila e histórico de notificações do cliente. |
| `integrations` | Configurações de webhooks e conectores específicos do cliente. |
| `audit` | Trilha de auditoria operacional das instâncias e dados. |

## Regra de Modelagem
- **metadata** deve ser relacional.
- **payload** de dados dinâmicos deve ser `JSONB`.
- O `workspace_id` é chave estrangeira mandatória em quase todas as tabelas do Runtime.
