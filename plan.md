1. **Define Core Domain Model Contract for Comments**
   - Create `src/modules/comments/contracts/entity-collaboration-contract.ts` defining the Zod schemas and TypeScript types for `EntityComment`, `EntityAttachment`, `CreateEntityCommentInput`, and `CreateEntityAttachmentInput`.
2. **Verify Comments Contract**
   - Verify the newly created file using `cat src/modules/comments/contracts/entity-collaboration-contract.ts`.
3. **Update Comments UI Component Types**
   - Update `src/modules/comments/entity-collaboration.tsx` to remove the local type definitions and import them from the newly created contract.
4. **Harden Comments Server Actions**
   - Update `src/modules/comments/actions.ts` to validate form inputs using the Zod schemas (e.g. `CreateEntityCommentInputSchema`) before inserting into the database, replacing the manual string reading logic.
5. **Define Core Domain Model Contract for Work Item Events**
   - Create `src/modules/work-items/contracts/work-item-event-contract.ts` defining the Zod schemas and TypeScript types for `WorkItemEvent`.
6. **Verify Work Item Events Contract**
   - Verify the newly created file using `cat src/modules/work-items/contracts/work-item-event-contract.ts`.
7. **Update Work Items Event Timeline Types**
   - Update `src/modules/work-items/event-timeline.tsx` to remove the local `WorkItemEvent` type definition and import it from the contract.
8. **Verify File Changes**
   - Verify changes using `cat` on `src/modules/comments/entity-collaboration.tsx`, `src/modules/comments/actions.ts`, and `src/modules/work-items/event-timeline.tsx`.
9. **Verify and Test**
   - Run `export EXPLICIT_ANY_BASE_REF=$(git rev-list --max-parents=0 HEAD) && source ~/.nvm/nvm.sh && nvm use 24 && npx tsc --noEmit && npm run check:no-explicit-any && npm run test` to confirm no type, explicit `any`, or test regressions.
10. **Code Review**
    - Call code review to evaluate the implementation.
11. **Pre-commit Steps**
    - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
12. **Submit**
    - Once all tests pass, submit the change with a descriptive commit message.
