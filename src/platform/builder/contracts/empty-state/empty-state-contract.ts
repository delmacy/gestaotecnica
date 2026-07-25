import { z } from "zod";

export const EmptyStateContextSchema = z.object({
  moduleKey: z.string(),
  hasData: z.boolean(),
}).strict();

export type EmptyStateContext = Readonly<z.infer<typeof EmptyStateContextSchema>>;

export const ViewStateSchema = z.enum(["empty", "blocked", "demo", "synthetic", "real"]);

export type ViewState = Readonly<z.infer<typeof ViewStateSchema>>;

export const ViewStateOutcomeSchema = z.object({
  state: ViewStateSchema,
  title: z.string(),
  description: z.string(),
  primaryActionLabel: z.string().optional(),
  primaryActionHref: z.string().optional(),
  isActionAllowed: z.boolean().default(true),
}).strict();

export type ViewStateOutcome = Readonly<z.infer<typeof ViewStateOutcomeSchema>>;
