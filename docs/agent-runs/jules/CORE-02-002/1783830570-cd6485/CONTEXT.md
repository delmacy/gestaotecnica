# Context

        CORE-02 Core lane. Predictively materialized at end of queue from repo-state.

Retry note: previous PR was closed because its Jules session completed while checks remained in changes_requested. Redo this task from main with the smallest scope possible; ensure `npm run build` passes and do not introduce explicit `any`.
