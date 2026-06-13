# Runtime Tenancy Security Contract

## Princípios Canônicos do Engine

1. Todo comando `start` ou `advance` **exige** um `workspaceId`.
2. Toda leitura de BD por parte do engine **exige** cláusula `WHERE workspace_id = ...`.
3. Process Instance, Payload, Action Execution, Event Logs e Outbox Messages **devem pertencer** ao mesmo workspace.
4. Os UUIDs sozinhos não compõem segurança (IDOR validation). Exigir apenas IDs não autoriza acesso.

## Auditoria de Vulnerabilidades AS-IS

O arquivo `runtime-step.service.ts` invoca:
```typescript
const version = await getProcessVersionById(db as any, instance.processVersionId);
```
**GAP Crítico Identificado:** A função `getProcessVersionById` localizada na área de "definition layer" não está sendo passada com o tenant da instância atual nesse contexto (ou ela já embute, mas a assinatura da chamada no runtime indica omissão de validação cruzada do `workspaceId` da process version em relação ao workspace da instância executada).

*Decisão*: A obtenção de artefatos compartilhados pode até ser isolada, mas a execução estrita exigirá validação: *A versão de processo que está rodando pertence ao mesmo tenant da instância que a está rodando?*

As `Server Actions` expostas na Phase 18 usam mock chumbado:
```typescript
const workspaceId = "00000000-0000-0000-0000-000000000000";
```
*Decisão*: As Server actions nunca são de domínio, mas os componentes do builder devem passá-lo explicitamente via props injetadas a partir da auth real.
