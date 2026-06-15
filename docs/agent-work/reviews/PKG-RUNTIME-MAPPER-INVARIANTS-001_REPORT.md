# Relatório de Verificação de Invariantes - Runtime Mappers

- **Package ID**: PKG-RUNTIME-MAPPER-INVARIANTS-001
- **Module**: runtime
- **Status**: SUCCESS WITH FINDINGS
- **Date**: 2025-05-15

## Escopo da Verificação
Verificação reduzida dos invariantes dos mapeadores de runtime (`ProcessInstance`, `ProcessPayload`, `ActionExecution`) após o merge do PR #185.

## Metodologia
- Criação de suíte de testes dedicada em `tests/unit/runtime-mapper-invariants.test.ts`.
- Utilização de `deepFreeze` (sem `any`) para garantir imutabilidade.
- Testes de precedência de aliases (camelCase vs snake_case).
- Testes de campos obrigatórios e proibidos.
- Testes de casos negativos (rejeição via Zod).
- **Restrição estrita**: Uso de `any` proibido; conformidade total com os tipos TypeScript.

## Resultados da Verificação

### ProcessInstance Mapper
- [PASSED] Precedência camelCase > snake_case.
- [PASSED] `workspaceId` e `processVersionId` obrigatórios.
- [PASSED] `definitionId` não reaparece no objeto mapeado.
- [PASSED] Imutabilidade do input garantida.
- [PASSED] Mesclagem de metadados via contexto sem mutação.

### ProcessPayload Mapper
- [PASSED] Precedência camelCase > snake_case.
- [PASSED] Preservação do campo `data`.
- [PASSED] `schemaVersion` obrigatório.
- [PASSED] Imutabilidade do input garantida.

### ActionExecution Mapper
- [PASSED] Precedência `actionKey` > `action_key` > `node_id`.
- [PASSED] Precedência `actorId` > `actor_id`.
- [PASSED] Preservação de `null` explícito para `actorId`.
- [PASSED] `correlationId` obrigatório.
- [FAILED] `causationId` obrigatório: O teste falhou pois o mapeador permite a ausência de `causationId` (conforme definido em `CausationIdSchema` em `src/platform/contracts/correlation.ts`). Contudo, o prompt de verificação exigia que este campo fosse obrigatório.
- [PASSED] Imutabilidade do input e dos payloads garantida.

### Casos Negativos
- [PASSED] Rejeição de status inválido.
- [PASSED] Rejeição de timestamp inválido.
- [PASSED] Rejeição de payload fora do contrato (data como string).

## Relação com a evidência original
Este pacote confirma que a implementação realizada no PR #185 adere aos invariantes de imutabilidade e precedência, exceto pelo campo `causationId` que, embora o prompt o trate como obrigatório, o contrato canônico do sistema o define como opcional. Esta divergência foi capturada pelo teste de invariante conforme solicitado.

## Conclusão
Os mapeadores de runtime operam conforme o esperado e respeitam as regras de precedência e imutabilidade. A falha no teste de `causationId` evidencia uma divergência entre a expectativa do prompt e o contrato técnico atual, cumprindo o papel de auditoria deste pacote.
