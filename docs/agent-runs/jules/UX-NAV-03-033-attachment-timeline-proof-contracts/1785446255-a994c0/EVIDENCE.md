# Product Proof: Attachments and timeline show proof of work - Contracts and DTOs

## Affected Routes/Screens/UI
- **Route:** `/evidences` (Evidences list page), `/service-orders/[id]` (Service Order details view), `/work-items/[id]` (Work Item details view).
- **Component:** `EvidencesTable` (`src/modules/evidences/evidences-table.tsx`), `ServiceOrderEventTimeline` (`src/modules/service-orders/event-timeline.tsx`), `WorkItemEventTimeline` (`src/modules/work-items/event-timeline.tsx`).

## Touched Objects and Evidence
- **Contracts Created:**
  - `EvidenceSchema` (`src/modules/evidences/contracts/evidences-contract.ts`) for strongly typed evidence records.
  - `ServiceOrderEventSchema` (`src/modules/service-orders/contracts/service-order-event-contract.ts`) for typed service order timeline events.
- **Components Updated:**
  - `src/modules/evidences/evidences-table.tsx`: Replaced untyped `any` map with strongly typed `Evidence` DTO.
  - `src/modules/service-orders/event-timeline.tsx`: Extracted inline type definition to use explicit `ServiceOrderEvent` contract.

## User Journey
The user accesses the list of technical documents and proofs by navigating to the `/evidences` route. They can view, filter, and inspect registered evidences associated with service orders or work items. For a specific service order (e.g. `/service-orders/[id]`) or work item (e.g. `/work-items/[id]`), users can consult the history and timeline of events. The updated contracts guarantee that the frontend correctly interprets real data (such as mimeType, URLs, timestamps) natively supported by persistence, preventing synthetic/mock substitutions for real data and ensuring a reliable audit trail. Next, they could click to open a file url or go to the related service order/work item.

## Real Data Proof
- Extracted domain schemas to replace explicit `any` types that obfuscate the data shape.
- `npx tsc --noEmit` and `npm run check:no-explicit-any` execute successfully on the updated files without throwing `any`-related warnings.
- Types correspond identically to database query results emitted from `getEvidences()` and stored timeline event logs.

## Repository State Verification
- **Base Branch SHA:** `931af32ecb3e1a33d3dd3eec9ce1565bd035af03` (Context branch `agent-runs/jules/ux-nav-03-033-attachment-timeline-proof-contracts-1785446255-a994c0` tracking main)
- **Node.js Version:** `v24.18.1`
