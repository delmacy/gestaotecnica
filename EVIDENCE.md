# Product Proof: UX-NAV-03-013 Form Submit Creates and Returns Work Status (Contracts and DTOs)

## Affected Route/Screen
This stage establishes the typed contracts for the "Form submit creates and returns work status" journey. It will ultimately affect any route/screen where work (like an Intake Request) is created and resolved to a status view (e.g., `/work-intake` -> `/work-intake/[id]`). At this stage, no new UI layers were implemented as this is strictly the Contracts and DTOs stage.

## Persisted Data Path / Contracts Modified
- **`src/platform/builder/contracts/work-status/work-status-contract.ts`**: Introduced `WorkStateSchema`, `WorkState`, `WorkStatusResolutionSchema`, and `WorkStatusResolution`. This explicitly defines the states (`empty`, `blocked`, `demo`, `synthetic`, `real`) that can be returned.
- **`src/platform/builder/contracts/work-status/resolve-work-status.ts`**: Implemented `resolveWorkStatus` to determine the outcome state and message based on the environment context, origin context restrictions, and whether the created data is "empty".
- **`src/platform/builder/contracts/index.ts`**: Exported the new contracts to make them accessible for future use case/API layers.

## Through-line and Product Constraints
- **Empty, Blocked, Demo, Synthetic, and Real-data States:** The contract and resolution function explicitly support and differentiate these states.
- **Type-safe:** No explicit `any` types were used. Strict `zod` schemas (`WorkStateSchema`, `WorkStatusResolutionSchema`) define the contract.
- **Commercial Language:** The `resolveWorkStatus` uses product-oriented language (e.g., "Access Restricted: You do not have permission to create or view this work.").
- **Real-Data Proof:** Since this is the contracts stage, it provides the schema that prevents synthetic data from being presented as real by explicitly forcing the resolution to declare its status (e.g., `real` vs `demo`). The next stage (Use Case/API) will connect this contract to the database persistence.
