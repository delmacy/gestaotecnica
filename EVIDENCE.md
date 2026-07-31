# Product Proof: Attachments and timeline show proof of work - Buttons, forms, and state feedback

## Affected Routes/Screens/UI
- **/evidences route:** Global evidence documentation form uses the `EvidenceForm` component which now receives `isPending`/`isSubmitting` tracking via React 19's `useActionState`.
- **/service-orders/[id] route:** Specific `ServiceOrderEvidenceForm` handles disabling UI form fields via `useActionState` tracking while operations are processing.

## Touched Objects and Evidence
- **Domain Object / Persistence:** State updates in `src/modules/evidences/actions.ts` and `src/modules/service-orders/actions.ts` correctly manage context tracking and dispatching events via `eventLogs`.
- **API Boundary / Form Actions:** Server Actions (`createEvidence` and `createServiceOrderEvidence`) were migrated to accept `prevState: unknown` mapping React form actions accurately.
- **Contract / UX Flow:** Next.js redirect calls inside server actions were replaced with proper object returns `{ id: string; status: 'success' }` providing seamless payload state to the `useWorkStatus` hook on the frontend layer.

## User Journey
The user navigates to `/evidences` or a specific `/service-orders/[id]` detail view. When submitting a new Evidence document (filling title, file URL, description), the `isSubmitting` flag instantly disables the form and updates the button label to "Registrando...", preventing multiple submissions. The form data hits the respective Server Action which handles database insertions safely. If the domain throws a handled runtime error, it surfaces in the form visually without destroying context. On success, `useWorkStatus` seamlessly catches the emitted Work ID, firing a success toast to the user via Sonner and resolving the work status.

## Real Data Proof
- Both Server Actions catch and re-throw `NEXT_REDIRECT` to comply with internal Next.js `useActionState` handling.
- Real user interface accurately disables via standard React `isPending` state natively without mock delays.
- Clean passing of strict `npm run check:no-explicit-any`. (The type `any` was specifically removed from `EvidenceForm` where assets maps previously ignored typings).
- Node Version used during task: `v24.18.1`
- Base Branch SHA: `931af32ecb3e1a33d3dd3eec9ce1565bd035af03`
