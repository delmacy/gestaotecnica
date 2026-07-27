import { z } from "zod";

export const JourneyStateSchema = z.enum([
  "empty",
  "blocked",
  "demo",
  "synthetic",
  "real"
]);

export type JourneyState = z.infer<typeof JourneyStateSchema>;

export const JourneyActionSchema = z.enum([
  "START",
  "NEXT_STEP",
  "PREVIOUS_STEP",
  "SAVE_DRAFT",
  "COMPLETE",
  "DISCARD"
]);

export type JourneyAction = z.infer<typeof JourneyActionSchema>;

export const JourneyResolutionSchema = z.object({
  /**
   * The destination path for the outcome.
   */
  destination: z.string(),

  /**
   * Contextual label for UI elements (e.g. "Continuing your setup", "Saving progress", "Workflow unavailable").
   */
  label: z.string(),

  /**
   * Status of the journey.
   */
  status: JourneyStateSchema,

  /**
   * Indicates if state should be committed (for complete or save draft).
   */
  commitState: z.boolean(),

  /**
   * Indicates if state should be cleared (for discard or sometimes complete).
   */
  clearState: z.boolean(),

  /**
   * A commercial/product oriented message for the user.
   */
  message: z.string().optional()
});

export type JourneyResolution = z.infer<typeof JourneyResolutionSchema>;
