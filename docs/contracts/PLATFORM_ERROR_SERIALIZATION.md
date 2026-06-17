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
* Rejeita o input se contiver chaves inseguras (`__proto__`, `prototype`, `constructor`) em qualquer profundidade.
* Ordena as chaves recursivamente de forma alfabética.
* Remove `undefined`, funções e symbols (via JSON.stringify).
* Garante que instâncias semanticamente iguais gerem a mesma string.

### `deserializePlatformError(serialized: string): PlatformErrorEnvelope`

Desserializa uma string JSON para um objeto validado e congelado.

* Exige que o input seja uma string.
* Rejeita JSON inválido (`INVALID_JSON`).
* Rejeita se o root não for um objeto (`INVALID_ENVELOPE`).
* Rejeita explicitamente se contiver chaves inseguras (`UNSAFE_KEY`) em qualquer profundidade.
* Valida contra o schema canônico (strict mode). Rejeita se inválido (`INVALID_ENVELOPE`).
* Retorna um objeto imutável (`Object.freeze`).

### `tryDeserializePlatformError(serialized: string)`

Versão segura da desserialização que nunca lança exceções.

Retorna:
* `{ success: true, data: PlatformErrorEnvelope }`
* `{ success: false, error: string }`

Mensagens de erro (`error`) possíveis:
* `INVALID_JSON`
* `UNSAFE_KEY`
* `INVALID_ENVELOPE`

## Segurança

### Rejeição de Unsafe Keys (Prototype Pollution)

Diferente de uma sanitização por remoção, o sistema **rejeita explicitamente** qualquer payload que contenha as chaves `__proto__`, `prototype` ou `constructor`. Esta verificação é recursiva e abrange:
* Objeto raiz
* Campos de metadados e detalhes (`metadata`, `details`)
* Erros causadores (`cause`)
* Itens de arrays (ex: `validationIssues`)

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
4. **Rejeição Explícita**: Chaves inseguras causam erro imediato, não são removidas silenciosamente.
