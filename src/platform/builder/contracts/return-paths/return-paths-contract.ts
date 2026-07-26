import { z } from "zod";

export const ActionOutcomeSchema = z.enum([
  "CREATE_SUCCESS",
  "CREATE_CANCEL",
  "EDIT_SUCCESS",
  "EDIT_CANCEL",
  "DELETE_SUCCESS",
  "DETAIL_BACK"
]);

export type ActionOutcome = z.infer<typeof ActionOutcomeSchema>;

export const ReturnPathResolutionSchema = z.object({
  /**
   * The destination path for the outcome.
   */
  destination: z.string(),

  /**
   * Contextual label for UI elements (e.g. toast notification, or button).
   */
  label: z.string(),

  /**
   * Status indicating if the return path was adjusted based on state.
   */
  status: z.enum(["normal", "intercepted", "blocked", "demo_restricted"]),

  /**
   * An optional message to display when the path is intercepted or restricted.
   */
  message: z.string().optional()
});

export type ReturnPathResolution = z.infer<typeof ReturnPathResolutionSchema>;
