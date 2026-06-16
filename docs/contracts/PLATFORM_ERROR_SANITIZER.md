# Platform Error Sanitizer (PKG-ERROR-SANITIZER-001)

## Objetivo
Converter um valor `unknown` em dados seguros e limitados que possam ser usados como `details` de um `PlatformErrorEnvelope`.

## Funcionamento
O sanitizador percorre recursivamente o objeto fornecido, aplicando regras de segurança para evitar vazamento de informações sensíveis, recursão infinita e execução de código malicioso através de getters.

## Allowlist (Raiz)
Somente as seguintes chaves são permitidas na raiz do objeto de saída:
- `name`
- `message`
- `code`
- `category`
- `status`
- `statusCode`
- `cause`
- `issues`
- `metadata`

## Redação de Segredos
Qualquer chave (em qualquer nível) que coincida (case-insensitive) com a lista abaixo terá seu valor substituído por `"[REDACTED]"`:
- `password`, `passwd`
- `secret`
- `token`, `accessToken`, `refreshToken`
- `authorization`
- `cookie`, `set-cookie`
- `apiKey`, `privateKey`
- `clientSecret`
- `connectionString`

## Limites
- **Profundidade máxima:** 5 níveis de processamento (0 a 4).
- **Truncamento:** No nível 5, objetos, arrays e o campo `cause` são substituídos por `"[TRUNCATED]"`.
- **Máximo de propriedades por objeto:** 50.
- **Máximo de itens por array:** 50.
- **Máximo de caracteres por string:** 2000.

## Ciclos e Referências
- Referências circulares são detectadas e substituídas por `"[CIRCULAR]"`.
- Referências compartilhadas sem ciclo são processadas normalmente.

## Tipos Especiais
- `Date`: convertida para ISO string (ou `"Invalid Date"`).
- `RegExp`, `URL`: convertidos para string.
- `Map`, `Set`, `ArrayBuffer`, `TypedArray`, `Promise`: convertidos para marcador `"[UNSUPPORTED:Type]"`.

## Segurança
- Não executa getters (usa `Object.getOwnPropertyDescriptor`).
- Proteção contra `Proxy` revogado e objetos hostis (uso de `try-catch` extensivo).
- Não utiliza `JSON.stringify` ou `String()` diretamente sem proteção.

## Exemplos

### Error Padrão
```typescript
const err = new Error("falha");
sanitizeUnknownError(err);
// { name: "Error", message: "falha" }
```

### Objeto com Segredo
```typescript
const obj = { message: "op", password: "123" };
sanitizeUnknownError(obj);
// { message: "op" } // password não está na allowlist da raiz
```

### Truncamento por Profundidade
```typescript
const input = { a: { b: { c: { d: { e: { f: "too deep" } } } } } };
sanitizeUnknownError(input);
// { a: { b: { c: { d: { e: "[TRUNCATED]" } } } } }
```

## Fora de Escopo
- Serialização para JSON (`PKG-ERROR-SERIALIZATION-001`).
- Mapeamento HTTP (`PKG-ERROR-HTTP-MAPPING-001`).
- Adaptadores de log (`PKG-ERROR-LOGGER-ADAPTER-001`).
