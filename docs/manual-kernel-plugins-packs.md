# Manual: Kernel, Plugins e Packs de Adaptação

## 1. Conceito

A plataforma é montada por capacidades.

- Módulos declaram actions, events, views e dependências.
- Actions executam trabalho e emitem events.
- Events entram em `event_logs` e `outbox_events`.
- Flows reagem a events e chamam outras actions.
- Adaptações configuram comportamento por cliente/workspace.

## 2. Criar uma action

1. Crie `src/modules/<modulo>/kernel-actions.ts`.
2. Exporte uma `ActionDefinition`.
3. Defina `key`, `moduleKey`, `callableBy`, `requiredModules` e `emits`.
4. Retorne `events` no `ActionResult` quando a action alterar estado.
5. Registre a action em `src/platform/kernel.ts`.

Padrão de chave:

```txt
<modulo>.<verbo>
```

Exemplos:

- `work_items.create`
- `service_orders.create`
- `documents.generate`
- `legacy_records.create`

## 3. Criar um evento

1. Registre o evento em `src/platform/events/default-events.ts`.
2. Use payload pequeno e orientado a integração.
3. Não coloque regra específica de cliente no evento.

Padrão de chave:

```txt
<entidade>.<acontecimento>
```

Exemplos:

- `work_item.created`
- `service_order.completed`
- `approval.requested`

## 4. Criar um flow

Flows de cliente devem ficar na adaptação:

```txt
src/adaptations/<cliente>/flows
```

O flow escuta um evento e chama actions.

Exemplo atual:

- `work-item-auto-service-order`
- `service-order-completed-notification`

## 5. Criar um módulo

Um módulo mínimo precisa de:

- `manifest.ts`
- `kernel-actions.ts`
- documentação em `docs/modulos`
- registro em `src/platform/kernel.ts`

O manifest deve declarar:

- `key`
- `name`
- `actions`
- `events`
- `views`
- `dependencies`

## 6. Criar um pack contextual

Um pack contextual é uma combinação de módulos que funcionam bem juntos.

Exemplos:

- Operação: `work-items`, `service-orders`, `assets`, `evidences`, `events`.
- Turnos: `shifts`, `schedules`, `workforce`, `work-items`.
- Governança: `approvals`, `documents`, `legacy`, `reports`.
- Automação: `automations`, `integrations`, `events`, `notifications`.

## 7. Adaptar para um cliente

1. Crie ou edite `src/adaptations/<cliente>`.
2. Configure terminologia, tipos, papéis, filas e templates.
3. Crie flows específicos em `flows/`.
4. Habilite módulos no workspace em `workspace_module_configs`.
5. Valide o catálogo em `GET /api/integrations/actions`.

## 8. Regras de segurança arquitetural

- O core não importa adaptações diretamente, exceto no bootstrap ativo da aplicação.
- Módulos não devem conhecer regra local de cliente.
- Adaptações devem compor actions existentes antes de pedir novas regras internas.
- Integrações externas devem chamar actions pelo gateway, não tabelas diretamente.

## 9. Próxima maturidade

- API keys reais.
- Worker dedicado para outbox.
- Contratos Zod/JSON Schema por action.
- Definições de flows em banco.
- UI administrativa para ativar módulos por workspace.
