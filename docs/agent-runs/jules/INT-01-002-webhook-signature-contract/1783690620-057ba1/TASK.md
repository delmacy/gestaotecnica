# INT-01-002-webhook-signature-contract - Add webhook signature contract

        Add a small pure webhook signature verification contract/helper boundary for webhook payloads without real provider coupling. Export it from the integrations contracts barrel and add focused unit coverage.
Allowed files only:
- src/platform/integrations/contracts/index.ts
- src/platform/integrations/contracts/webhook-signature.ts
- tests/unit/integrations/webhook-signature.test.ts
