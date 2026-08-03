# UX-NAV-03-032-attachment-timeline-proof-core-domain - Evidence

## Stage objective
Implement or harden domain entities, invariants, state machine rules, workspace scoping, and lifecycle semantics for the slice `Attachments and timeline show proof of work`.

## Required product proof

### Route/screen/menu/button affected
- **Work Items Detail Screen:** `/work-items/[id]` (Displays `WorkItemEventTimeline` and `EntityCollaboration`)
- **Service Orders Detail Screen:** `/service-orders/[id]` (Displays `ServiceOrderEventTimeline` and `EntityCollaboration`)
- **Assets Detail Screen:** `/assets/[id]` (Displays `AssetEventTimeline` and `HistoryTimeline`)

### Database/persistence object, domain object, contract, use case/API path, or validation evidence touched
- **Domain Object / Contracts created:**
  - `src/modules/comments/contracts/entity-collaboration-contract.ts` (Introduced schemas/types for `EntityComment` and `EntityAttachment`).
  - `src/modules/work-items/contracts/work-item-event-contract.ts` (Introduced schemas/types for `WorkItemEvent`).
- **Database schemas associated:**
  - Legacy `entityAttachments` and `entityComments` defined in `src/db/legacy/schema.ts`.
  - Runtime workflow `events` queried in `src/modules/work-items/queries.ts`.
- **Validation Evidence:**
  - Component files `src/modules/comments/entity-collaboration.tsx`, `src/modules/work-items/event-timeline.tsx`, `src/modules/service-orders/event-timeline.tsx`, and `src/modules/assets/event-timeline.tsx` were hardened by replacing explicit `any` iterator types with strictly defined domain DTOs (`EntityComment`, `EntityAttachment`, `WorkItemEvent`, `ServiceOrderEvent`, `AssetEvent`).
  - `npm run check:no-explicit-any` successfully passed on these updated files without regressions.

### User Journey
- **How they reach the screen:** A user logs in and navigates from the main dashboard to a list view (e.g., Demands/Work Items). From the list, they select an item to view its details, directing them to the `/work-items/[id]` route.
- **What they do:** On the detail screen, the user scrolls to view the `EntityCollaboration` component where they can add or review historical comments and attachments. Below that, they view the `WorkItemEventTimeline` to see the audit trail of lifecycle events and proof of work.
- **Where they go next:** They might interact with side action forms (e.g., transition status, link a service order), or click an attachment URL to download/view the file.
- **How they return:** The top Action Bar or breadcrumb link (e.g., "Voltar para WorkItems") allows them to return to the list view. Submitting a new comment or attachment performs a server action that naturally redirects them back to the same detail page using the `returnTo` field.

### Real-data proof or precise blocker
- **Real-data proof:**
  - The `EntityCollaboration` component is hydrated directly by `getEntityComments` and `getEntityAttachments` queries using Drizzle ORM against the legacy `entity_comments` and `entity_attachments` tables.
  - The Event Timelines are hydrated by `getWorkItemEvents` querying the runtime `events` table. No fake demo success or mocked fallbacks are injected into these domain interfaces. The components simply map over the rigorously typed result sets returned by the backend data layer.
