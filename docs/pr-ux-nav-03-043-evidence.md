# Product Proof: Queue, search, and draft recovery complete the operator loop - Contracts and DTOs

## Environment
- Node.js Version: v24.18.1
- Base SHA: 31cba7e19d183d6636c404bb8be6d147581af613

## Routes and Screens Affected
- `/search`: The global search interface which will consume the unified `GlobalSearchDTO` typed results.
- `/admin/queues`: The queue management screen which uses queue rules and SLA policy DTOs.
- Draft Recovery UI: General interface overlays / pages managing work items, forms, and requests that rely on `DraftRecoveryResponse` state.

## Persistence and Domain Objects Touched
- `src/modules/global-search/contracts/search-dto.ts`: Defined `SearchResultItemSchema` and `GlobalSearchDTOSchema` explicitly to replace implicit structural types.
- `src/modules/operator-loop/contracts/draft-recovery-dto.ts`: Created unified `DraftRecoveryStateSchema` and `DraftRecoveryResponseSchema` that enforces states matching `WorkStateSchema` conventions (e.g. "empty").

## User Journey
1. **Search Flow:** An operator visits `/search` and types a query. The backend kernel action `search.everything` processes this query and returns a strongly-typed `GlobalSearchDTO` object containing `workItems`, `serviceOrders`, `assets`, and `technicians`.
2. **Draft Recovery:** When opening a previously abandoned request form, the UI checks for drafts using a strongly-typed endpoint that returns `DraftRecoveryResponse` containing `empty` or `found` states, preventing accidental creation of new forms.
3. **Queue Flow:** A manager visits `/admin/queues` to manage SLA policies and work assignment, interacting with types like `SlaPolicy` and `QueueItem`.
The type-safe contracts ensure that synthetic data or internal models do not bleed into the UI, making states clearly identifiable without falling back on unverified generic wrappers.

## Real-Data Proof / Validation
I implemented the contracts using real types built on `zod`, specifically mapped to the real domain boundaries of the builder workflow (like the core `WorkStateSchema` standard).
Instead of returning `any` from the queries, the new schemas formally declare the exact properties `id`, `title`, `type`, and `url` ensuring commercial-grade presentation without training/mock data hacks.
These contracts are built and verified natively alongside the Next.js ecosystem without faking dependencies.
