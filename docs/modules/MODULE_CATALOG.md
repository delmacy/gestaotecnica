# Module Catalog

| Module | Classification | Responsibility |
|---|---|---|
| `platform-core` | architectural_module | Funções bases do builder e schema unificado (tec_db) |
| `shared-kernel` | shared_module | Helpers genéricos e tipagens compartilhadas |
| `shared-ui` | shared_module | Componentes visuais básicos React/Next |
| `shared-contracts` | shared_module | Interfaces e Zod schemas entre domínios |
| `platform-infrastructure` | architectural_module | Configuração do Drizzle, DB connection, middlewares |
| `documentation-governance` | coordination_module | Políticas e documentação de processos (Jules Doc) |
| `tasker-agent-work` | coordination_module | Controle do trabalho de IAs e humanos, lock paralelos |
| `process-mirroring` | bounded_context | Captura da realidade do processo as-is |
| `capability-catalog` | business_capability | Definições universais de capacidades empresariais |
| `registry` | technical_module | Indexador do que está instalado/disponível |
| `enterprise-architecture` | business_capability | Mapas conceituais cruzando capabilities/sistemas |
| `governance` | business_capability | RBAC e limits de controle |
| `enablement` | ui_surface | Superfície para treinar operadores (guias) |
| `form-builder` | ui_surface | UI visual para mock de forms |
| `view-builder` | ui_surface | UI visual para mock de views |
| `workflow-builder` | ui_surface | UI visual para mock de workflows |
| `workflow-definitions` | bounded_context | Definição declarativa da engine do sistema |
| `runtime-engine` | architectural_module | Execução canônica das regras em cima de estados |
| `events-receipts` | technical_module | Armazenamento imutável de log de eventos |
| `integration-gateway` | technical_module | Recebimento e envio assíncrono para o Edge (Outbox) |
