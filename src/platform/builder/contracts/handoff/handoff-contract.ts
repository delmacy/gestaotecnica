import { z } from "zod";

export const BuilderHandoffRequestSchema = z.object({
  appId: z.string(),
  version: z.string(),
  environmentId: z.string(),
});

export type BuilderHandoffRequest = z.infer<typeof BuilderHandoffRequestSchema>;

export const BuilderHandoffResponseSchema = z.object({
  success: z.boolean(),
  runtimeUrl: z.string(),
  handoffToken: z.string().optional(),
  message: z.string().optional(),
  status: z.enum(['success', 'empty', 'blocked', 'demo', 'synthetic']).optional()
});

export type BuilderHandoffResponse = z.infer<typeof BuilderHandoffResponseSchema>;
