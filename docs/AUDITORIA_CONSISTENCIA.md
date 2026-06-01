# Auditoria de Consistência Builder → Runtime

Esta auditoria valida se os artefatos visuais gerados no System Builder (`/builder`) possuem correspondência estrutural completa e funcional no Runtime.

## Avaliação dos Construtores (Builders)

| Builder | Visual (UI) | Salva no DB? | Executa no Runtime? | Status Geral |
|---|---|---|---|---|
| **Capability Builder** | ✔️ Funcional | ✔️ Tabela `registry.capabilities` | ⚠️ Mapeamento de permissões/papéis incompleto. | Parcial |
| **Flow Builder** (`flow-builder.tsx`) | ✔️ Funcional (XYFlow) | ✔️ Tabela `workflow.flow_definitions` | ✔️ Lida pelo `FlowRunner` | **Operacional** |
| **Process Builder** (`process-builder.tsx`) | ✔️ Funcional (Estados/Ações) | ✔️ Tabelas `states`, `transitions`, `actions` | ✔️ Executado via `ProcessOrchestrator` | **Operacional** |
| **Form Builder** | ✔️ Funcional | ✔️ Tabelas `forms`, `form_fields` | ⚠️ Renderização no client precisa de ajuste para amarrar os valores em `process_payloads` no submit | Parcial |
| **View Builder** | ✔️ Funcional | ❌ Salva config de layout, mas as rotas dinâmicas Next.js não estão roteando `/[entitySlug]` corretamente. | ❌ Apenas UI | Não Iniciado / Mock |
| **Module Builder / Organization Builder** | ✔️ Funcional | ✔️ `workspaces`, `organizations` | ✔️ Bootstrapping do workspace cria registros. | **Operacional** |
| **Platform Timeline** | ✔️ Funcional | ✔️ Tabela `events` | ✔️ Registra e lê via `event-timeline.tsx` | **Operacional** |

## Lacunas Críticas Encontradas (Tarefa 3)

1. **Roteamento Dinâmico de Views:** O Builder cria "Views" (telas) no banco, mas a interface final (Runtime) não possui um `src/app/[workspace]/[view]/page.tsx` para carregar e renderizar o componente dinâmico genérico que consome as tabelas do `workflow`. Atualmente, as rotas ainda apontam para `/service-orders`, `/work-items`, etc. (hardcoded).
2. **Bind de Formulários e Payloads:** O `Form Builder` gera o schema, mas a invocação da "Ação" no Frontend (Runtime) que deveria injetar os dados no `process_payloads.data` não está plenamente acoplada. Muitas ações usam mock no client.

## Plano de Fechamento de Lacunas

- Criar rota Catch-All `src/app/[workspaceKey]/[moduleKey]/[viewKey]/page.tsx` que aja como o verdadeiro **View Engine** do Runtime.
- Atualizar o `executeKernelAction` para garantir que submissões de formulário dinâmicas injetem os dados em `process_payloads`.
