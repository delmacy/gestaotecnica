# Platform Error Serialization

## Identification

* Package ID: `PKG-ERROR-SERIALIZATION-001`
* Module: `platform-errors`

## API Pública

```ts
import {
  serializePlatformError,
  deserializePlatformError,
  tryDeserializePlatformError
} from "@/platform/errors";
```

### `serializePlatformError(envelope: PlatformErrorEnvelope): string`

Serializa um envelope de erro para uma string JSON determinística.

* Valida o input contra o schema `PlatformErrorEnvelopeSchema`.
* Ordena as chaves recursivamente de forma alfabética.
* Filtra chaves proibidas (`__proto__`, `prototype`, `constructor`).
* Remove `undefined`, funções e symbols.
* Garante que instâncias semanticamente iguais gerem a mesma string.

### `deserializePlatformError(serialized: string): PlatformErrorEnvelope`

Desserializa uma string JSON para um objeto validado e congelado.

* Exige que o input seja uma string.
* Rejeita JSON inválido.
* Rejeita se o root não for um objeto.
* Neutraliza propriedades de prototype pollution.
* Valida contra o schema canônico (strict mode).
* Retorna um objeto imutável (`Object.freeze`).

### `tryDeserializePlatformError(serialized: string)`

Versão segura da desserialização que nunca lança exceções.

Retorna:
* `{ success: true, data: PlatformErrorEnvelope }`
* `{ success: false, error: string }`

Mensagens de erro retornadas são seguras e limitadas (`INVALID_JSON`, `INVALID_ENVELOPE`).

## Segurança

### Proteção contra Prototype Pollution

Tanto na serialização quanto na desserialização, chaves como `__proto__`, `prototype` e `constructor` são explicitamente removidas ou ignoradas em qualquer profundidade.

### Determinismo

Propriedades de objetos são ordenadas alfabeticamente. Arrays preservam sua ordem original conforme o contrato.

```ts
const env1 = { id: "1", message: "Error" };
const env2 = { message: "Error", id: "1" };

serializePlatformError(env1) === serializePlatformError(env2); // true
```

## Invariantes

1. **Imutabilidade**: `deserializePlatformError` sempre retorna objetos congelados.
2. **Pureza**: As funções não dependem de estado global ou efeitos colaterais.
3. **Não-mutação**: Os objetos de entrada nunca são alterados.
