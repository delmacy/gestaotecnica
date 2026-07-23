import { z } from "zod";

export const CapabilityStatusSchema = z.enum(["active", "pending_setup", "blocked", "coming_soon"]);
export type CapabilityStatus = z.infer<typeof CapabilityStatusSchema>;

export const CommercialCapabilitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  status: CapabilityStatusSchema,
});
export type CommercialCapability = z.infer<typeof CommercialCapabilitySchema>;

export const TenantCommercialContextSchema = z.object({
  workspaceId: z.string(),
  activeCapabilities: z.array(CommercialCapabilitySchema),
  quotas: z.record(z.string(), z.number()),
  utilizationMetrics: z.record(z.string(), z.number()),
});
export type TenantCommercialContext = z.infer<typeof TenantCommercialContextSchema>;
