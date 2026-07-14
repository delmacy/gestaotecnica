import { z } from 'zod';

export const DefinitionRuntimeReadinessResultSchema = z.object({
  ready: z.boolean({
    message: "MISSING_READY_FLAG"
  }),
  missingActions: z.array(z.string().min(1, { message: "EMPTY_ACTION" }), {
    message: "MISSING_MISSING_ACTIONS"
  }),
  invalidNodes: z.array(z.string().min(1, { message: "EMPTY_NODE" }), {
    message: "MISSING_INVALID_NODES"
  }),
  versionBlockers: z.array(z.string().min(1, { message: "EMPTY_BLOCKER" }), {
    message: "MISSING_VERSION_BLOCKERS"
  })
});

export type DefinitionRuntimeReadinessResult = Readonly<z.infer<typeof DefinitionRuntimeReadinessResultSchema>>;
