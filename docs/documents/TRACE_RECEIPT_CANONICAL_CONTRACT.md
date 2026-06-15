# Trace Receipt Canonical Contract

## Conceito

O **Trace Receipt** é um artefato canônico da plataforma projetado para fornecer prova imutável e verificável de uma ação executada sobre um documento ou entidade. Ele funciona como um recibo digital que consolida o "quem", "o quê", "quando", "onde" e "como" de uma transação, permitindo auditoria detalhada e rastreabilidade de ponta a ponta.

## Finalidade

- **Comprovação de Autoria:** Identifica o ator (usuário, sistema, agente) que realizou a ação.
- **Integridade de Dados:** Utiliza hashes criptográficos para garantir que o conteúdo e os artefatos associados não foram alterados.
- **Cadeia de Custódia:** Permite encadear recibos através de referências ao recibo anterior (`previousReceiptId`).
- **Auditabilidade:** Facilita a reconstrução histórica de eventos críticos para conformidade e governança.

## Estrutura do Contrato

### Subject

Define a entidade afetada pela ação. Suporta diversos tipos através de uma união discriminada. O esquema é estrito para evitar campos não documentados.

- `process`
- `process_instance`
- `action_execution`
- `document`
- `asset`
- `work_request`
- `form`
- `notification`
- `custom` (requer `category`)

### Actor

Identifica quem executou a ação:

- `user`: Usuário humano.
- `service`: Serviço interno.
- `agent`: Agente autônomo.
- `system`: Sistema automatizado.
- `external`: Entidade externa.

### Action

Descreve a operação realizada:

- `type`: Categoria da ação (ex: `create`, `sign`, `approve`).
- `name`: Nome legível.
- `description`: Detalhes opcionais.
- `result`: Resultado (`success`, `failure`, `partial`, `cancelled`).

### Artifacts

Referências a arquivos ou dados produzidos durante a ação.

- `id`, `name`, `mediaType`, `uri`, `size`.
- **Política de URI:** Suporta URLs absolutas (`https`) e esquemas explícitos de storage/referência: `s3://`, `minio://`, `file://`, ou `urn:`.
- `hashReference`: Referência ao hash correspondente na lista de hashes.
- `metadata`: Dados adicionais contextuais.

### Hashes

Lista de hashes calculados para garantir a integridade.

- Algoritmos suportados: `sha256` (64 chars), `sha512` (128 chars).
- Escopos: `receipt`, `artifact`, `payload`, `document`.

## Canonicalização

Para garantir que o hash de um recibo seja determinístico, o payload deve ser canonicalizado. O processo envolve:

1. **Ordenação de chaves:** Propriedades de objetos são ordenadas alfabeticamente.
2. **Recursão em Arrays:** Elementos de arrays são processados recursivamente.
3. **Tipos Suportados:** `null`, `boolean`, `number`, `string` (Unicode).
4. **Undefined:** Propriedades `undefined` em objetos são omitidas; em arrays são convertidas para `null`.

## Payload Assinável (Signable Payload)

Para evitar circularidade (um hash não pode conter a si mesmo), o hash do recibo é calculado sobre um payload assinalável gerado pela função `createSignableReceiptPayload(receipt)`.

**Regras de Exclusão:**
- São excluídos todos os itens da lista `hashes` cujo `scope` seja `receipt`.
- Artifact hashes e outros escopos permanecem no payload.

## Verificação

A verificação é determinística e requer contexto explícito:
- **Entradas:** `receipt`, `algorithm`, `expectedHash`, `verifiedAt` (timestamp).
- **Processo:**
  1. Gera o payload assinalável do recibo.
  2. Calcula o hash usando o algoritmo especificado.
  3. Compara com o `expectedHash`.
  4. Retorna `TraceReceiptVerificationResult` com o timestamp fornecido.

## Cadeia de Recibos

O campo `previousReceiptId` permite criar uma trilha encadeada.
- Regra: Um recibo não pode apontar para si mesmo.
- A função `linkReceiptToPrevious` gera um novo objeto validado.

## Exemplo JSON

```json
{
  "id": "rec-789",
  "workspaceId": "123e4567-e89b-12d3-a456-426614174000",
  "subject": {
    "type": "document",
    "id": "doc-001"
  },
  "actor": {
    "type": "user",
    "id": "usr-123",
    "name": "Alice Auditor"
  },
  "action": {
    "type": "signature",
    "name": "Digital Signature",
    "result": "success"
  },
  "timestamp": "2023-10-27T14:30:00Z",
  "source": {
    "origin": "document-service",
    "version": "1.0.2"
  },
  "artifacts": [
    {
      "id": "art-999",
      "name": "signed_doc.pdf",
      "mediaType": "application/pdf",
      "uri": "s3://buckets/docs/signed_doc.pdf",
      "size": 524288,
      "hashReference": "h-1"
    }
  ],
  "hashes": [
    {
      "algorithm": "sha256",
      "value": "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce",
      "scope": "artifact"
    }
  ],
  "correlationId": "corr-xyz-123"
}
```
