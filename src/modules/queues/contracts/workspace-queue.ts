import { z } from "zod";

export const WorkspaceQueueSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  key: z.string().min(1),
  label: z.string().min(1),
  description: z.string().nullable().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int(),
  config: z.record(z.string(), z.unknown()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type WorkspaceQueue = z.infer<typeof WorkspaceQueueSchema>;
