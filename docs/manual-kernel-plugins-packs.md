# Manual: Kernel, Plugins e Packs de Adaptacao

## 1. Conceito

A plataforma e montada por capacidades.

- Modulos declaram actions, events, views e dependencias.
- Actions executam trabalho e emitem events.
- Events entram em `event_logs` e `outbox_events`.
- Flows reagem a events e chamam outras actions.
- Adaptacoes configuram comportamento por cliente/workspace.

## 2. Criar uma action

1. Crie `src/modules/<modulo>/kernel-actions.ts`.
2. Exporte uma `ActionDefinition`.
3. Defina `key`, `moduleKey`, `callableBy`, `requiredModules` e `emits`.
4. Retorne `events` no `ActionResult` quando a action alterar estado.
5. Registre a action em `src/platform/kernel.ts`.

Padrao de chave:

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
2. Use payload pequeno e orientado a integracao.
3. Nao coloque regra especifica de cliente no evento.

Padrao de chave:

```txt
<entidade>.<acontecimento>
```

Exemplos:

- `work_item.created`
- `service_order.completed`
- `approval.requested`

## 4. Criar um flow

Flows de cliente devem ficar na adaptacao:

```txt
src/adaptations/<cliente>/flows
```

O flow escuta um evento e chama actions.

Exemplo atual:

- `work-item-auto-service-order`
- `service-order-completed-notification`

## 5. Criar um modulo

Um modulo minimo precisa de:

- `manifest.ts`
- `kernel-actions.ts`
- documentacao em `docs/modulos`
- registro em `src/platform/kernel.ts`

O manifest deve declarar:

- `key`
- `name`
- `actions`
- `events`
- `views`
- `dependencies`

## 6. Criar um pack contextual

Um pack contextual e uma combinacao de modulos que funcionam bem juntos.

Exemplos:

- Operacao: `work-items`, `service-orders`, `assets`, `evidences`, `events`.
- Turnos: `shifts`, `schedules`, `workforce`, `work-items`.
- Governanca: `approvals`, `documents`, `legacy`, `reports`.
- Automacao: `automations`, `integrations`, `events`, `notifications`.

## 7. Adaptar para um cliente

1. Crie ou edite `src/adaptations/<cliente>`.
2. Configure terminologia, tipos, papeis, filas e templates.
3. Crie flows especificos em `flows/`.
4. Habilite modulos no workspace em `workspace_module_configs`.
5. Valide o catalogo em `GET /api/integrations/actions`.

## 8. Regras de seguranca arquitetural

- O core nao importa adaptacoes diretamente, exceto no bootstrap ativo da aplicacao.
- Modulos nao devem conhecer regra local de cliente.
- Adaptacoes devem compor actions existentes antes de pedir novas regras internas.
- Integracoes externas devem chamar actions pelo gateway, nao tabelas diretamente.

## 9. Proxima maturidade

- API keys reais.
- Worker dedicado para outbox.
- Contratos Zod/JSON Schema por action.
- Definicoes de flows em banco.
- UI administrativa para ativar modulos por workspace.
