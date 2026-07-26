import { z } from "zod";

export const CancelBackActionSchema = z.enum([
  "CANCEL",
  "BACK",
  "DISCARD"
]);

export type CancelBackAction = z.infer<typeof CancelBackActionSchema>;

export const CancelBackResolutionSchema = z.object({
  /**
   * The destination path for the outcome.
   */
  destination: z.string(),

  /**
   * Contextual label for UI elements (e.g. "Discard Configuration", "Return to Portfolio", or "Cancel Update").
   */
  label: z.string(),

  /**
   * Status indicating if the return path was adjusted based on state.
   */
  status: z.enum(["normal", "intercepted", "blocked", "demo_restricted"]),

  /**
   * Indicates if intervention (discard gate) is required before navigating.
   */
  requiresIntervention: z.boolean(),

  /**
   * An optional message to display when the path is intercepted or restricted, or for the discard intervention.
   */
  message: z.string().optional()
});

export type CancelBackResolution = z.infer<typeof CancelBackResolutionSchema>;
