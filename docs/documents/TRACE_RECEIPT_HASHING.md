# Hashing e Verificação de Trace Receipt

## Objetivo
Implementar hashing determinístico e verificação de integridade para Trace Receipts e seus componentes (artefatos, payloads, documentos).

## Algoritmos Suportados
- **SHA-256**: Produz um hash de 64 caracteres hexadecimais.
- **SHA-512**: Produz um hash de 128 caracteres hexadecimais.

## Canonicalização
Antes de qualquer operação de hashing, o valor de entrada é processado pela função `canonicalizeTraceValue`. Isso garante que:
- Chaves de objetos sejam ordenadas lexicograficamente.
- Espaços em branco e formatação não influenciem o resultado.
- Tipos não suportados (BigInt, funções, referências circulares) sejam rejeitados.

## Encoding
- **Entrada**: UTF-8.
- **Saída**: Hexadecimal lowercase.

## Determinismo
A mesma entrada lógica sempre produzirá o mesmo hash, independentemente da ordem original das propriedades no objeto JavaScript.

## Funções Públicas

### `hashCanonicalTraceValue(value, algorithm)`
Canonicaliza o valor e retorna a string hexadecimal do hash.

### `createTraceHash(value, algorithm, scope)`
Gera um objeto `TraceReceiptHash` validado pelo schema, contendo o algoritmo, o escopo e o valor do hash.

### `verifyTraceHash(value, hash)`
Verifica se um valor corresponde a um objeto `TraceReceiptHash`.
- Realiza comparação em tempo constante (`timingSafeEqual`) para evitar ataques de temporização.
- Valida estruturalmente o objeto de hash antes da comparação.
- Propaga erros de canonicalização.

## Escopo (Scope)
Os hashes podem ser aplicados a diferentes partes do ecossistema de rastreabilidade:
- `receipt`: O próprio Trace Receipt.
- `artifact`: Um arquivo ou recurso externo vinculado.
- `payload`: O dado bruto da operação.
- `document`: Um documento formal associado.

## Política sobre o campo `hashes`
Este pacote não remove automaticamente o campo `hashes` de um receipt ao calcular seu hash. `hashCanonicalTraceValue` trabalha exatamente sobre o valor recebido. A lógica para tratar "payload assinável" (removendo hashes para evitar auto-referência) deve ser implementada em camadas superiores.

## Exemplos

```typescript
import { createTraceHash, verifyTraceHash } from "@platform/traceability";

const data = { id: "123", status: "completed" };
const hash = createTraceHash(data, "sha256", "payload");

const isValid = verifyTraceHash(data, hash); // true
```

## Limites e Fora de Escopo
Este pacote foca exclusivamente em hashing puro e determinístico. Estão fora de escopo:
- Assinaturas digitais (RSA, ECDSA).
- HMAC ou chaves privadas.
- Linking (encadeamento) de receipts.
- Persistência ou armazenamento.

Os seguintes pacotes tratarão dessas funcionalidades:
- `PKG-TRACE-RECEIPT-SIGNABLE-PAYLOAD-001`
- `PKG-TRACE-RECEIPT-LINKING-001`
- `PKG-TRACE-RECEIPT-SIGNATURE-001`
