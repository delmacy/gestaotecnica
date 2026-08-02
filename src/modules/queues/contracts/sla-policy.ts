import { z } from "zod";
import { PrioritySchema } from "./queue-item";

export const SlaPolicySchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  key: z.string().min(1),
  label: z.string().min(1),
  targetEntityType: z.string().min(1),
  priority: PrioritySchema,
  responseMinutes: z.number().int().min(0),
  resolutionMinutes: z.number().int().min(0),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SlaPolicy = z.infer<typeof SlaPolicySchema>;

export const CreateSlaPolicySchema = SlaPolicySchema.pick({
  key: true,
  label: true,
  targetEntityType: true,
}).extend({
  responseMinutes: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return 240;
    return Number(v);
  }, z.number().int().min(0).default(240)),
  resolutionMinutes: z.preprocess((v) => {
    if (v === "" || v === null || v === undefined) return 1440;
    return Number(v);
  }, z.number().int().min(0).default(1440)),
});

export type CreateSlaPolicyDTO = z.infer<typeof CreateSlaPolicySchema>;
