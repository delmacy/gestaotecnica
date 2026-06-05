# Context Pack: Persistence

## 1. Objetivo do Domínio
Centralizar as operações transacionais de salvamento, atualizações em banco de dados e controle das Definições do Processo. Assegurar arquitetura correta ao intermediar conexões do frontend/server actions com as consultas subjacentes.

## 2. Arquivos Principais
- `src/features/workflow/definitions/process-definition.repository.ts`
- `src/features/workflow/definitions/process-definition.queries.ts`
- `src/features/workflow/definitions/process-definition.service.ts`

## 3. Decisões Ativas
- As Services e Repositories devem ser puramente lógicos. Elas recebem a transação do Drizzle por Injeção de Dependências ou Factory, evitando travar um único client.
- O Frontend gerencia autosave em memória e `localStorage`. Mas a persistência final explícita (Salvamento Oficial) deve trafegar pelos Server Actions que invocam a Service layer.
- Responses padronizados da camada server: `{ok: true, data}` ou `{ok: false, error: {code, message}}`.

## 4. Anti-Escopo
- Actions do Frontend (`Next.js`) não devem importar Repositories nem fazer Queries Drizzle diretas sem ir pela fronteira Action -> Server/Service.

## 5. Próximas Fases Relacionadas
- Expansão da camada Persistence (Fase 17B) para gerenciar `process_instances` e `process_instance_steps` seguindo as mesmas diretrizes modulares da API de Definition.