# Package Report: PKG-ERROR-SERIALIZATION-001

## Status
- Package ID: `PKG-ERROR-SERIALIZATION-001`
- Module: `platform-errors`
- Status: Completed (Revision 1)

## Implementação
- Implementada serialização determinística com ordenação recursiva de chaves.
- Implementada desserialização com validação rigorosa via Zod.
- **Segurança Crítica**: Implementada rejeição explícita (`UNSAFE_KEY`) para chaves `__proto__`, `prototype` e `constructor` em qualquer profundidade, em vez de remoção silenciosa.
- Adicionado wrapper seguro `tryDeserializePlatformError` com classificação de erro robusta.

## Arquivos Criados/Alterados
- `src/platform/errors/serialization.ts`: Lógica de serialização e scanners de segurança.
- `src/platform/errors/index.ts`: Exportação das novas funções.
- `tests/unit/platform-error-serialization.test.ts`: Testes de unidade abrangentes (incluindo fixtures JSON hostis).
- `docs/contracts/PLATFORM_ERROR_SERIALIZATION.md`: Documentação do contrato atualizada.
- `docs/agent-work/reviews/PKG-ERROR-SERIALIZATION-001_REPORT.md`: Este relatório.

## Verificação
- **Testes Unitários**: 17 casos de teste cobrindo casos de sucesso, erro, determinismo, imutabilidade e rejeição de chaves inseguras. Todos aprovados.
- **Build**: `npm run build` executado com sucesso.
- **Sanitizer Integration**: Verificada integração com `sanitizeUnknownError`.

## Política de Segurança contra Prototype Pollution
A rotina `assertNoUnsafeKeys` escaneia recursivamente o objeto (incluindo propriedades não-enumeráveis via `getOwnPropertyNames`) e lança `new Error("UNSAFE_KEY")` ao encontrar qualquer chave proibida.
- **Deserialização**: O escaneamento ocorre imediatamente após `JSON.parse` e antes da validação Zod.
- **Serialização**: O escaneamento ocorre após a validação Zod para garantir que metadados/detalhes não contenham chaves hostis.

## Classificação de Erros
Os erros em `tryDeserializePlatformError` são classificados em:
1. `INVALID_JSON`: Erro de sintaxe JSON.
2. `UNSAFE_KEY`: Detecção de chave de prototype pollution.
3. `INVALID_ENVELOPE`: Falha na estrutura do root ou validação do schema Zod.

## Exemplo de Round Trip Seguro
```ts
const serialized = serializePlatformError(envelope);
const result = tryDeserializePlatformError(serialized);

if (result.success) {
  const envelope = result.data;
  // envelope is frozen and validated
}
```
