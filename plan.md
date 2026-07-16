1. **Fix explicit any in timeline.service.ts**
   - The CI check specifically failed on `src/platform/observability/application/timeline.service.ts` line 35. We will replace `(run: any)` with `(run: typeof flowRuns.$inferSelect)` using `replace_with_git_merge_diff`:
```
<<<<<<< SEARCH
    timelineItems.push(
      ...fRuns.map((run: any) => ({
        id: run.id,
        type: "event",
=======
    timelineItems.push(
      ...fRuns.map((run: typeof flowRuns.$inferSelect) => ({
        id: run.id,
        type: "event",
>>>>>>> REPLACE
```
2. **Verify timeline.service.ts update**
   - Run `cat src/platform/observability/application/timeline.service.ts` to verify the change.
3. **Project-wide checks**
   - Run `npm run check:architecture`, `npm run check:no-explicit-any`, `npm run build`, and `npm run test` in a dedicated bash session.
4. **Complete pre-commit steps**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. **Submit PR**
   - Run `git add .` and `git commit --amend --no-edit` using `run_in_bash_session`, and explicitly use `git push -f origin jules/v-01-003-timeline-contract` and `gh pr create --title "Refactor: Extract TimelineItem contract" --body "Converts TimelineItem into a formal Zod schema"` (via the plan steps format, not execution) then use the `submit` tool to conclude the task.
