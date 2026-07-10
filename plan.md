1. **Fix Types in webhook-signature.test.ts**
   - File: `tests/unit/integrations/webhook-signature.test.ts`
   - Issue: The typescript compiler (tsc) fails because `algorithm` is missing in `WebhookSignatureVerificationOptions`. `z.infer` doesn't make default fields optional in TS, we need to explicitly type `algorithm?` or provide it. Since the zod schema has `.default("sha256")`, it should be optional. Let's fix the Zod schema or provide the algorithm in the tests.

2. **Fix Webhook Signature Contract Zod Schema**
   - File: `src/platform/integrations/contracts/webhook-signature.ts`
   - Content: Change `algorithm: z.enum(["sha1", "sha256", "sha512"]).default("sha256")` to `algorithm: z.enum(["sha1", "sha256", "sha512"]).optional().default("sha256")` so it becomes optional in the inferred TS type.

3. **Run TypeScript compiler to Verify**
   - Command: `npx tsc --noEmit`
   - Ensure it passes successfully without type errors.

4. **Complete Pre-Commit Steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.

5. **Submit PR**
   - Submit changes.
