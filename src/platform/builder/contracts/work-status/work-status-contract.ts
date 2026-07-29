import { z } from "zod";
import { EventReceiptSchema } from "@/platform/events/event-types";

export const WorkStateSchema = z.enum([
  "empty",
  "blocked",
  "demo",
  "synthetic",
  "real"
]);

export type WorkState = z.infer<typeof WorkStateSchema>;

export const WorkStatusResolutionSchema = z.object({
  /**
   * The destination path for the outcome.
   */
  destination: z.string(),

  /**
   * Status of the work creation.
   */
  status: WorkStateSchema,

  /**
   * A commercial/product oriented message for the user.
   */
  message: z.string().optional(),

  /**
   * Evidence receipt of the operation.
   */
  receipt: EventReceiptSchema.optional()
});

export type WorkStatusResolution = z.infer<typeof WorkStatusResolutionSchema>;
