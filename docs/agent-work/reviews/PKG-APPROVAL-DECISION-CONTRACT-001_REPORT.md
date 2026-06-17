# Report: PKG-APPROVAL-DECISION-CONTRACT-001

## Visão Geral
Implementação do contrato canônico de Decisão de Aprovação (`ApprovalDecision`) no módulo de `governance`.

## Arquivos Criados/Alterados
- `src/platform/governance/contracts/approval-decision.ts` (Novo: Contrato Zod)
- `src/platform/governance/contracts/index.ts` (Novo: Export)
- `src/platform/governance/index.ts` (Novo: Export)
- `docs/governance/APPROVAL_DECISION_CONTRACT.md` (Novo: Documentação)
- `tests/unit/approval-decision-contract.test.ts` (Novo: Testes unitários)
- `docs/agent-work/reviews/PKG-APPROVAL-DECISION-CONTRACT-001_REPORT.md` (Este arquivo)

## Contratos Reutilizados
- `ActorReferenceSchema` (de `src/platform/contracts/actor.ts`)
- `EntityIdSchema` (de `src/platform/contracts/identifiers.ts`)
- `WorkspaceIdSchema` (de `src/platform/contracts/identifiers.ts`)
- `ISODateTimeSchema` (de `src/platform/contracts/time.ts`)
- `TraceReceiptHashSchema` (de `src/platform/documents/traceability/contracts.ts`)
- `UnknownRecordSchema` (de `src/platform/contracts/payload.ts`)

## Sujeitos de Aprovação Incluídos
- `process_version`
- `form_definition`
- `utility_app_definition`

## Política de Justificativa
- Obrigatória para `rejected` e `changes_requested`.
- Mínimo de 10 caracteres após `trim()`.
- Máximo de 2000 caracteres.

## Política de Hash
- Reutiliza `TraceReceiptHashSchema` (SHA-256 ou SHA-512).
- Campo opcional `approvedContentHash`.

## Resultados de Testes
- Todos os testes unitários passaram.
- Build realizado com sucesso.

## Conformidade
- Sem workflow ou persistência implementados.
- Sem uso de `any`.
- Strict mode ativado nos esquemas.
- Input não mutado (congelado via `Object.freeze`).
