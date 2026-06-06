# Agent Gateway

O **Agent Gateway** é a fronteira futura e exclusiva para comunicação de agentes externos (como os orquestrados pelo Paperclip) com o System Builder.

## Princípios
- **Não é CRUD genérico:** A API expõe capacidades intencionais (e.g., `POST /api/agent/process-candidates`), não acesso direto a banco de dados.
- **Autenticação:** Todo acesso requer identificação (e.g., `x-agent-key`) e vinculação a um `workspace_id`.
- **Rastreabilidade (Idempotência e Correlation):** Para evitar duplicações e rastrear a cadeia de raciocínio do agente.
- **Aprovação Obrigatória:** O Gateway rejeita qualquer tentativa de publicação direta. O agente só pode propor.
