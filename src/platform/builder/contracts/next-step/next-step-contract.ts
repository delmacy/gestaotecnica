import { z } from "zod";

export const NextStepOutcomeSchema = z.enum([
  "CREATE_ENTITY_SUCCESS",
  "PROCESS_ANALYSIS_SUCCESS",
  "UPDATE_ENTITY_SUCCESS",
  "DELETE_ENTITY_SUCCESS",
  "WORKFLOW_COMPLETED"
]);

export type NextStepOutcome = z.infer<typeof NextStepOutcomeSchema>;

export const NextStepResolutionSchema = z.object({
  /**
   * The destination path for the next step.
   */
  destination: z.string(),

  /**
   * Contextual label for UI elements (e.g. toast notification).
   */
  label: z.string(),

  /**
   * Status indicating if the next step was adjusted based on state.
   */
  status: z.enum(["normal", "intercepted", "blocked", "demo_simulation"]),

  /**
   * An optional message to display when the path is intercepted or restricted.
   */
  message: z.string().optional()
});

export type NextStepResolution = z.infer<typeof NextStepResolutionSchema>;
