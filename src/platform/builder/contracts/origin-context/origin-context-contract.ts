import { z } from "zod";

export const OriginContextSchema = z.object({
  /**
   * The referring route or conceptual origin.
   */
  originPath: z.string().nullable(),

  /**
   * Safe return paths strictly based on the origin context.
   */
  returnPath: z.string().nullable(),

  /**
   * Contextual label for UI elements like a cancel/back button.
   * "Return to Operations", "Back to Intake", etc.
   */
  returnLabel: z.string().nullable(),

  /**
   * Internal state flags for UI outcome logic.
   */
  isDemo: z.boolean(),
  isSynthetic: z.boolean(),
  isBlocked: z.boolean(),

  /**
   * Determines if the context crossed boundaries (e.g., Platform vs Workspace).
   */
  isValidScope: z.boolean(),
});

export type OriginContext = z.infer<typeof OriginContextSchema>;
