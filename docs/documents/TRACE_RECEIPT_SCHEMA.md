# Trace Receipt Schema

## Objetivo

Este documento define o contrato canônico para **Trace Receipts** na plataforma. O Trace Receipt é uma evidência imutável de uma ação realizada no sistema, contendo metadados de rastreabilidade, referências a artefatos e hashes criptográficos para garantir a integridade.

## Entidades

### TraceReceipt

A entidade principal que encapsula toda a evidência.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `EntityId` | Identificador único do recibo. |
| `workspaceId` | `WorkspaceId` | Workspace ao qual o recibo pertence. |
| `subject` | `TraceReceiptSubject` | O objeto ou recurso alvo da ação. |
| `actor` | `TraceReceiptActor` | Quem ou o que realizou a ação. |
| `action` | `TraceReceiptAction` | Descrição da ação realizada e seu resultado. |
| `timestamp` | `ISODateTime` | Momento em que a ação foi registrada. |
| `source` | `TraceReceiptSource` | Origem técnica do registro (sistema, versão). |
| `artifacts` | `TraceReceiptArtifact[]` | Lista de artefatos relacionados (documentos, payloads). |
| `hashes` | `TraceReceiptHash[]` | Assinaturas digitais/hashes para verificação de integridade. |
| `correlationId` | `CorrelationId` | Identificador de correlação para rastreio entre serviços. |
| `previousReceiptId` | `EntityId?` | Opcional. Referência ao recibo anterior em uma cadeia. |
| `causationId` | `CausationId?` | Opcional. Referência à causa que gerou esta ação. |
| `metadata` | `UnknownRecord?` | Opcional. Metadados extensíveis. |

### TraceReceiptSubject

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `type` | `Enum` | `process`, `process_instance`, `action_execution`, `document`, `asset`, `work_request`, `form`, `notification`, `custom`. |
| `id` | `EntityId` | ID do recurso. |
| `category` | `string?` | Obrigatório se o tipo for `custom`. |

### TraceReceiptActor

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `type` | `Enum` | `user`, `service`, `agent`, `system`, `external`. |
| `id` | `EntityId` | ID do ator. |
| `name` | `string?` | Nome legível do ator. |

### TraceReceiptAction

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `type` | `string` | Tipo técnico da ação (ex: `create`, `update`). |
| `name` | `string` | Nome amigável da ação. |
| `description`| `string?` | Detalhes adicionais. |
| `result` | `Enum` | `success`, `failure`, `partial`, `cancelled`. |

### TraceReceiptArtifact

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | `EntityId` | ID único do artefato. |
| `name` | `string` | Nome do arquivo ou recurso. |
| `mediaType` | `string` | MIME type (ex: `application/pdf`). |
| `uri` | `string` | URI de acesso. |
| `size` | `number` | Tamanho em bytes (não negativo). |
| `hashReference`| `string?`| Referência ao hash correspondente na lista de hashes. |

## Algoritmos e Scopes

### Algoritmos de Hash

- `sha256`: Comprimento de 64 caracteres hexadecimais.
- `sha512`: Comprimento de 128 caracteres hexadecimais.

### Scopes de Hash

- `receipt`: Hash do recibo inteiro.
- `artifact`: Hash de um artefato específico.
- `payload`: Hash do payload de dados original.
- `document`: Hash de um documento de negócio relacionado.

## Política de URI

Apenas as seguintes URIs são permitidas:

- `https://`
- `s3://`
- `minio://`
- `file://`
- `urn:`

## Exemplos

### Exemplo Mínimo

```json
{
  "id": "rcpt_123",
  "workspaceId": "550e8400-e29b-41d4-a716-446655440000",
  "subject": {
    "type": "document",
    "id": "doc_456"
  },
  "actor": {
    "type": "user",
    "id": "usr_789"
  },
  "action": {
    "type": "sign",
    "name": "Assinar Documento",
    "result": "success"
  },
  "timestamp": "2023-10-27T10:00:00Z",
  "source": {
    "system": "core-api",
    "version": "1.0.0"
  },
  "artifacts": [],
  "hashes": [],
  "correlationId": "corr_abc"
}
```

## Limites deste Pacote

Este pacote implementa **apenas** as definições de schema e validação estrutural.

Não estão incluídos:
- Lógica de canonicalização (sorting de keys).
- Geração de hashes.
- Persistência em banco de dados.
- Integração com serviços de storage.

## Pacotes Futuros

- `PKG-TRACE-RECEIPT-CANONICALIZATION-001`: Implementação da lógica de serialização determinística.
- `PKG-TRACE-RECEIPT-HASHING-001`: Implementação da geração de hashes SHA-256/512.
- `PKG-TRACE-RECEIPT-LINKING-001`: Helper para encadeamento de recibos (Chaining).
