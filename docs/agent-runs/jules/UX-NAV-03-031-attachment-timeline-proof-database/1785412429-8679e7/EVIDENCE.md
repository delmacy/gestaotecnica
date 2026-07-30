# Evidence: UX-NAV-03-031-attachment-timeline-proof-database

## Base Branch
Base SHA: f74c618d6159a9153f32511b856af0bb0476b9ef

## Node.js Environment
```bash
$ node --version
v24.18.1
```

## Objective Fulfilled
This stage implemented the database/persistence foundation for "Attachments and timeline show proof of work". Specifically, it sets up the seeded baseline state for Work Items to have attached files and recorded historical events to power the UI capabilities required by this product slice.

## Required Product Proof

### Affected Route/Screen/Menu/Button
- The main affected route is `/work-items/[id]`.
- Specifically, the `EntityCollaboration` component which renders attachments and the `WorkItemEventTimeline` component which renders the history of events for the work item.
- By providing seed data here, the system's "View Work Item Detail" page will successfully render these data elements from the persistence layer.

### Persistence Objects Touched
- `entityAttachments` (from `src/db/legacy/schema.ts`): We explicitly added seed and clean operations for this persistence object to bind attachments to the work items.
- `events` (from `src/db/runtime/schema/workflow.ts`): We explicitly added seed and clean operations for this object to act as the audit log/history for the timeline feature.

### User Journey (Builder Navigation Amendment included)
1. The user, operating under the selected workspace `ws_work_items` (within organization `org_work_items`), navigates to `/work-items`.
2. From the list of work items, they click to view the details of a specific demand (e.g., "Equipamento de TI Falho - Work Items Seed"), arriving at `/work-items/[id]`.
3. On this screen, they will see the populated "Historico" (Timeline) showing the exact events of creation and status changes, and the "Anexos" section showing the proof of work (e.g., "Foto do equipamento falho" linking to the asset).
4. Users can return via the "Voltar para WorkItems" button.

### Synthetic Fixture Validation
The execution of the seed scripts demonstrates the successful baseline creation of synthetic seed data (including "example.com" placeholders). This validates that the persistence layer can physically store and link attachments and events to work items.

```
$ ALLOW_SEED=true npx tsx src/db/seeds/work-items/seed.ts
Starting seed for Work Items
[Seed] Organization already exists: 37202869-6621-4a4d-aba5-de4dca7288d6
[Seed] Workspace already exists: deda33a4-ceb9-4119-83ee-91bad53a5f3c
[Seed] User already exists in Runtime: ceca020f-46f4-4d9e-b86b-3e658d818791
[Seed] Module already exists: 850553b7-14df-43f3-8672-378771ce76be
[Seed] Capability already exists: cap_work_items_view
[Seed] Capability already exists: cap_work_items_manage
[Seed] Work Item already exists: 50d90bf8-6dd3-442f-a192-a4f08ea8489f
[Seed] Created Entity Attachment: b4fe9733-b878-45aa-87f9-9faf3eabea4d
[Seed] Created Events for work item: 6d1fbaee-9d9c-439f-8f90-8c07910734f1, 6cfe7730-363a-4a9a-a2b9-d7109c761ce0
Seed finished for Work Items
```

### Presentation States Verification
- **Synthetic Data State:** Shown above; explicitly labeled seed data populated for testing the timeline and attachments components locally without external real dependencies.
- **Empty State:** Distinctly handled by the components `EntityCollaboration` and `WorkItemEventTimeline` displaying "Nenhum evento registrado" and "Nenhum anexo registrado" when no records exist for a genuine work item.
- **Real-Data Blocker:** Real, multi-tenant persistence data is completely blocked in local environments due to the absence of active user generated payload traffic; this stage intentionally bounds its proof to verified seeded fixtures in the database layer. No fake runtime interactions were substituted as real data.
