# Package Report: PKG-ERROR-SERIALIZATION-001

## Status
- Package ID: `PKG-ERROR-SERIALIZATION-001`
- Module: `platform-errors`
- Status: Completed

## Implementação
- Implementada serialização determinística com ordenação recursiva de chaves.
- Implementada desserialização com validação rigorosa via Zod.
- Implementada proteção contra Prototype Pollution removendo chaves inseguras (`__proto__`, `prototype`, `constructor`).
- Adicionado wrapper seguro `tryDeserializePlatformError`.

## Arquivos Criados/Alterados
- `src/platform/errors/serialization.ts`: Lógica central de serialização.
- `src/platform/errors/index.ts`: Exportação das novas funções.
- `tests/unit/platform-error-serialization.test.ts`: Testes de unidade abrangentes.
- `docs/contracts/PLATFORM_ERROR_SERIALIZATION.md`: Documentação do contrato.
- `docs/agent-work/reviews/PKG-ERROR-SERIALIZATION-001_REPORT.md`: Este relatório.

## Verificação
- **Testes Unitários**: 15 casos de teste cobrindo casos de sucesso, erro, determinismo, imutabilidade e segurança. Todos aprovados.
- **Build**: `npm run build` executado com sucesso.
- **Sanitizer Integration**: Verificada integração com `sanitizeUnknownError`.

## Segurança contra Prototype Pollution
A estratégia adotada foi a limpeza recursiva de objetos em busca de chaves proibidas.
- Na serialização: chaves proibidas são ignoradas.
- Na desserialização: após `JSON.parse`, o objeto resultante passa pela rotina de limpeza antes da validação Zod.

## Exemplo de Round Trip Seguro
```ts
const envelope = {
  id: "err-1",
  code: "DOMAIN.USER.NOT_FOUND",
  category: "not_found",
  severity: "error",
  message: "User not found",
  timestamp: "2023-10-27T10:00:00Z"
};

const serialized = serializePlatformError(envelope);
const deserialized = deserializePlatformError(serialized);

assert.deepEqual(envelope, deserialized);
assert.ok(Object.isFrozen(deserialized));
```
