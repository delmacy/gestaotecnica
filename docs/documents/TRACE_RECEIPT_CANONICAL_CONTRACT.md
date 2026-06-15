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

Define a entidade afetada pela ação. Suporta diversos tipos através de uma união discriminada:

- `process`
- `process_instance`
- `action_execution`
- `document`
- `asset`
- `work_request`
- `form`
- `notification`
- `custom` (permite categorias adicionais)

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

Referências a arquivos ou dados produzidos durante a ação. Cada artefato contém:

- `id`, `name`, `mediaType`, `uri`, `size`.
- `hashReference`: Referência ao hash correspondente na lista de hashes.
- `metadata`: Dados adicionais contextuais.

### Hashes

Lista de hashes calculados para garantir a integridade.

- Algoritmos suportados: `sha256`, `sha512`.
- Escopos: `receipt`, `artifact`, `payload`, `document`.

## Canonicalização

Para garantir que o hash de um recibo seja determinístico, o payload deve ser canonicalizado antes do hashing. O processo envolve:

1. **Ordenação de chaves:** Todas as propriedades de objetos são ordenadas alfabeticamente.
2. **Preservação de Arrays:** A ordem dos elementos em arrays é mantida.
3. **Serialização Determinística:** Produz uma string JSON consistente independente da ordem original das propriedades na memória.

## Cadeia de Recibos

O campo `previousReceiptId` permite criar uma trilha encadeada.
- Regra: Um recibo não pode apontar para si mesmo.
- A verificação de integridade da cadeia exige um repositório externo para validar a existência e o hash do recibo anterior.

## Verificação

A verificação consiste em:
1. Recalcular o hash do recibo (usando canonicalização).
2. Comparar com o valor esperado.
3. Validar se os artefatos referenciados possuem hashes consistentes.

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
      "uri": "https://s3.example.com/buckets/docs/signed_doc.pdf",
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
  "correlationId": "corr-xyz-123",
  "metadata": {
    "ip_address": "192.168.1.50"
  }
}
```

## Evolução Futura

- **Assinatura Assimétrica:** Implementação de assinaturas digitais (RSA/ECDSA) para garantir não-repúdio.
- **Integração com Storage:** Automação do cálculo de hash durante o upload para provedores de storage (S3/MinIO).
- **Blockchain/Immutable Ledgers:** Persistência dos hashes em livros razão imutáveis para provas de existência externas.
