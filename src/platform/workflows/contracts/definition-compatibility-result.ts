import { z } from 'zod';

export const DefinitionCompatibilityResultSchema = z.object({
  compatible: z.boolean({
    message: "MISSING_COMPATIBLE_FLAG"
  }),
  warnings: z.array(z.string().min(1, { message: "EMPTY_WARNING" }), {
    message: "MISSING_WARNINGS"
  }),
  blockers: z.array(z.string().min(1, { message: "EMPTY_BLOCKER" }), {
    message: "MISSING_BLOCKERS"
  })
});

export type DefinitionCompatibilityResult = Readonly<z.infer<typeof DefinitionCompatibilityResultSchema>>;
