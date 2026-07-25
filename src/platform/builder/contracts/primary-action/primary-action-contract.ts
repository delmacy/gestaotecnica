import { z } from "zod";

export const PrimaryActionStateSchema = z.enum([
  "active",
  "blocked",
  "hidden"
]);

export type PrimaryActionState = Readonly<z.infer<typeof PrimaryActionStateSchema>>;

export const PrimaryActionIntentSchema = z.object({
  id: z.string(),
  label: z.string(),
  state: PrimaryActionStateSchema,
  tooltipMessage: z.string().optional(),
  href: z.string().optional(),
}).strict();

export type PrimaryActionIntent = Readonly<z.infer<typeof PrimaryActionIntentSchema>>;

export const PrimaryActionContextSchema = z.object({
  moduleKey: z.string(),
  routeContext: z.string(),
}).strict();

export type PrimaryActionContext = Readonly<z.infer<typeof PrimaryActionContextSchema>>;
