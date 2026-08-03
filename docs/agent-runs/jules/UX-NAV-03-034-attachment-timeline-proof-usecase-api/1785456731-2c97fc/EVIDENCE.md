# Product Proof: Attachments and timeline show proof of work - Use case and API binding

## Affected Routes/Screens/UI
- **API Route:** `src/app/api/evidences/route.ts` - New API endpoint providing GET and POST handlers for evidence creation and listing.
- **Components:** Will be consumed by `EvidencesTable` and timeline views on `/evidences`, `/service-orders/[id]`, and `/work-items/[id]` screens.

## Touched Objects and Evidence
- **Database Object:** `evidences` table and related `events` records inserted through `runAction("evidences.attach", ...)` mapping.
- **Contract:** `AttachEvidenceInputSchema` implemented and imported from `src/modules/evidences/contracts/evidences-contract.ts` to strictly validate payload.
- **Use Case:** Invoked `runAction("evidences.attach", validation.data, context)` with resolved workspace context guaranteeing proper validation and scoping.

## User Journey
Users (or integrated systems) interact with the platform by submitting forms on the `/evidences` screen or detail pages (like `/service-orders/[id]`). This action targets the `/api/evidences` POST endpoint, carrying data formatted strictly according to the domain schema. The API route extracts context from the user's workspace, validates the input structure via the schema, and calls the `evidences.attach` use-case handler logic safely without exposing direct persistence operations. Validations prevent submissions with empty mandatory fields (like `title`). Success records the evidence along with an emitted event for audit capabilities. The user remains on or returns to the corresponding timeline or evidences list where newly persisted data renders.

## Real Data Proof
- API handles correct validation against `AttachEvidenceInputSchema` via Zod before invoking domain rules in `evidences.attach`.
- Integrated `resolveWorkspaceContext` seamlessly bridges incoming request contexts to platform authorization guards.
- Code avoids synthetic overrides and accurately tracks event receipts created directly from the emitted event payload through `createReceipt`.
- `npx tsc --noEmit` and `npm run check:no-explicit-any` execute successfully on the updated files without throwing `any`-related warnings.

## Repository State Verification
- **Base Branch SHA:** 931af32ecb3e1a33d3dd3eec9ce1565bd035af03 (Context branch `agent-runs/jules/ux-nav-03-034-attachment-timeline-proof-usecase-api-1785456731-2c97fc` tracking main)
- **Node.js Version:** v24.18.1
