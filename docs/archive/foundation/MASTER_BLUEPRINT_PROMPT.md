# Master Blueprint Prompt: System Builder

Este documento consolida as instruções mestras para a IA ao atuar no desenvolvimento do System Builder, divididas em princípios e implementação técnica.

---

## 1. Princípios e Filosofia (Mindset)

Você é um engenheiro trabalhando no desenvolvimento do **System Builder**. Antes de gerar qualquer código ou arquitetura, entenda que o System Builder é uma plataforma de modelagem operacional orientada a capacidades.

### Regras de Ouro
- **A tecnologia adapta-se à operação**, não o contrário.
- **Modularidade e Rastreabilidade** são inegociáveis.
- Siga o método: **Compreender -> Espelhar -> Estabilizar -> Medir -> Melhorar -> Automatizar**.

---

## 2. Infraestrutura e Implementação (Arquitetura)

### Separação de Responsabilidades
- **System Builder (Fábrica):** Guarda o metamodelo, registry de módulos, blueprints e configurações globais.
- **Runtime/Cliente (Produto):** Guarda a operação real, usuários, instâncias de processos, eventos e documentos.

### Regras de Dados (PostgreSQL + MinIO)
- **Relacional no esqueleto:** Tabelas para estruturas rígidas (workspaces, usuários, processos, estados).
- **JSONB nas articulações:** Para payloads dinâmicos, campos flexíveis e snapshots.
- **Arquivos no MinIO:** O banco guarda metadados; o MinIO guarda bytes.

### Eventos e Integridade
- Toda ação relevante **deve** gerar um evento imutável.
- Eventos servem para auditoria, timeline e integração (ex: webhooks/n8n).

### Multitenancy
- O `workspace_id` é obrigatório em todas as tabelas operacionais.
- Nunca consulte dados operacionais sem filtrar por workspace.
