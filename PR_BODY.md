# Blocked/Error/Fallback Paths - Frontend Experience

## Objective
Implement the user-facing route/menu/flow experience for Blocked, Error, and Fallback Paths according to the predefined contract. This ensures safe interception and provides clear, product-oriented navigation paths back to known safe states for users when errors or authorization failures occur.

## Implementation Details
1. **Global and Scoped Error Boundaries:** Updated `src/app/error.tsx` and created `src/app/(builder)/builder/error.tsx` to handle 500-level errors with commercial terminology ("Temporary Disruption", "Please try again later or contact support").
2. **Missing Entity (Not Found) Handling:** Added `src/app/(builder)/builder/not-found.tsx` and updated the catch-all `src/app/(builder)/builder/[...catchAll]/page.tsx` to display "Configuration Unavailable" with a clear fallback action ("Return to Workspace").
3. **Frontend API Hook (`useBlockedFallback`):** Created a client-side hook in `src/components/builder/shared/hooks/useBlockedFallback.ts` to seamlessly communicate with the backend `/api/builder/navigation/blocked-fallback` endpoint and resolve context-aware safe return paths.
4. **Journey Validation App Component:** Implemented `src/app/(builder)/builder/ui-contracts/blocked-fallback-test/page.tsx` to natively mount and test the hook against all block cases (Demo restricted, Workspace Access Denied, Not Found, etc.).

## Validation
* E2E Playwright tests explicitly validate the contract conditions.
* Run: `npx playwright test tests/e2e/builder/blocked-fallback-contract.spec.ts`
* Output: 4 passed.
* See `EVIDENCE.md` for specific user journey definitions.

## Constraints
* No new explicit `any` types were introduced.
* No mock data or fake behavior was invented outside of the `blocked-fallback` contract.
* UI language adheres to the commercial product orientation.
