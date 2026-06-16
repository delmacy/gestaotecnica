# Process Definition Schema

## Objetivo
Este documento define os contratos canônicos mínimos para `ProcessDefinition` e `ProcessVersion` no módulo `workflow-definitions`. Estes contratos servem como base para a execução de workflows, separando a lógica de runtime das preocupações visuais do Builder.

## ProcessDefinition
A entidade pai que agrupa versões de um mesmo processo de negócio.

### Campos
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `EntityId` | Sim | Identificador único da definição. |
| `workspaceId` | `WorkspaceId` | Sim | Identificador do workspace (multi-tenancy). |
| `key` | `ProcessDefinitionKey` | Sim | Identificador amigável e único dentro do workspace. |
| `name` | `string` (1-200) | Sim | Nome legível do processo. |
| `status` | `ProcessDefinitionStatus` | Sim | `draft`, `published`, `archived`. |
| `createdAt` | `ISODateTime` | Sim | Data de criação. |
| `updatedAt` | `ISODateTime` | Sim | Data da última atualização. |
| `createdById` | `EntityId` | Sim | Identificador do autor. |
| `description` | `string` (max 2000) | Não | Descrição detalhada do propósito do processo. |
| `publishedVersionId` | `EntityId` | Não | ID da versão que está atualmente publicada. |
| `blueprintKey` | `string` | Não | Referência a um blueprint de origem, se houver. |
| `blueprintVersion` | `integer` | Não | Versão do blueprint de origem. |
| `metadata` | `UnknownRecord` | Não | Dados técnicos adicionais. |

## ProcessVersion
Uma imutável instância de configuração de um processo em um determinado momento.

### Campos
| Campo | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | `EntityId` | Sim | Identificador único da versão. |
| `workspaceId` | `WorkspaceId` | Sim | Identificador do workspace. |
| `processDefinitionId` | `EntityId` | Sim | Referência à `ProcessDefinition` pai. |
| `version` | `integer` | Sim | Número sequencial da versão (>= 1). |
| `status` | `ProcessVersionStatus` | Sim | `draft`, `published`, `archived`. |
| `createdAt` | `ISODateTime` | Sim | Data de criação. |
| `updatedAt` | `ISODateTime` | Sim | Data da última atualização. |
| `createdById` | `EntityId` | Sim | Identificador do autor. |
| `definition` | `object` | Sim | Envelope do grafo (nodes e edges). |
| `publishedAt` | `ISODateTime` | Condicional | Obrigatório se `status` for `published`. |
| `publishedById` | `EntityId` | Condicional | Obrigatório se `status` for `published`. |
| `changeSummary` | `string` | Não | Resumo das alterações em relação à versão anterior. |
| `metadata` | `UnknownRecord` | Não | Dados técnicos adicionais. |

## Regras de Identificação (Key)
A `key` de uma `ProcessDefinition` segue as seguintes restrições:
- Entre 3 e 100 caracteres.
- Inicia com letra minúscula (`a-z`).
- Contém apenas letras minúsculas, números e hífens.
- Não termina com hífen.
- Não permite hífens consecutivos.

Regex: `^[a-z](?:[a-z0-9]|-(?!-))*[a-z0-9]$`

## Envelope de Definição (Temporário)
Neste pacote, a estrutura interna de `nodes` e `edges` não é validada semanticamente para evitar acoplamento prematuro com o Builder.
```json
{
  "schemaVersion": "1.0.0",
  "nodes": [],
  "edges": [],
  "metadata": {}
}
```

## Ausência de isActive
O campo `isActive` foi removido em favor do campo `status`, que oferece uma granularidade maior de estados de ciclo de vida.

## Exemplos

### ProcessDefinition (Draft)
```json
{
  "id": "def-99",
  "workspaceId": "ws-1",
  "key": "onboarding-cliente",
  "name": "Onboarding de Cliente",
  "status": "draft",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z",
  "createdById": "user-1"
}
```

### ProcessVersion (Published)
```json
{
  "id": "ver-1",
  "workspaceId": "ws-1",
  "processDefinitionId": "def-99",
  "version": 1,
  "status": "published",
  "createdAt": "2023-10-27T10:00:00Z",
  "updatedAt": "2023-10-27T10:00:00Z",
  "createdById": "user-1",
  "publishedAt": "2023-10-27T11:00:00Z",
  "publishedById": "user-1",
  "definition": {
    "schemaVersion": "1.0.0",
    "nodes": [],
    "edges": []
  }
}
```

## Limites do Pacote
- Não implementa validação de grafo.
- Não implementa mappers ou serviços.
- Não define tipos específicos para `Node` ou `Edge`.

## Próximos Pacotes
1. `PKG-PROCESS-NODE-EDGE-SCHEMA-001`: Definição canônica de nodes e edges.
2. `PKG-PROCESS-DEFINITION-VALIDATION-001`: Validação semântica e lógica de grafos.
3. `PKG-PROCESS-DEFINITION-MAPPER-001`: Mapeamento entre Builder e contratos canônicos.
4. `PKG-PROCESS-PUBLICATION-CONTRACT-001`: Contratos de intenção e eventos de publicação.
