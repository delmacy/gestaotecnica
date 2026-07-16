import { z } from "zod";

export const CapabilityCategorySchema = z.enum([
  'foundation',
  'relationship',
  'work-management',
  'resource',
  'information',
  'control',
  'intelligence',
  'commercial',
  'legal'
]);
export type CapabilityCategory = Readonly<z.infer<typeof CapabilityCategorySchema>>;

export const CapabilityMvpPrioritySchema = z.enum([
  'critical',
  'high',
  'medium',
  'low',
  'future'
]);
export type CapabilityMvpPriority = Readonly<z.infer<typeof CapabilityMvpPrioritySchema>>;

export const CapabilityStatusSchema = z.enum([
  'documented',
  'needs_review',
  'ready_for_design',
  'future',
  'blocked'
]);
export type CapabilityStatus = Readonly<z.infer<typeof CapabilityStatusSchema>>;

export const CapabilityInstallStateSchema = z.enum([
  'available',
  'simulated_requested',
  'not_available',
  'future'
]);
export type CapabilityInstallState = Readonly<z.infer<typeof CapabilityInstallStateSchema>>;

export const CapabilityDependencySchema = z.string();
export type CapabilityDependency = Readonly<z.infer<typeof CapabilityDependencySchema>>;

export const CapabilityBoundarySchema = z.object({
  type: z.enum(['overlap', 'composition', 'external']),
  description: z.string(),
}).strict();
export type CapabilityBoundary = Readonly<z.infer<typeof CapabilityBoundarySchema>>;

export const CapabilityDocumentLinkSchema = z.object({
  title: z.string(),
  url: z.string(),
}).strict();
export type CapabilityDocumentLink = Readonly<z.infer<typeof CapabilityDocumentLinkSchema>>;

export const CapabilityItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: CapabilityCategorySchema,
  description: z.string(),
  core_business: z.boolean(),
  mvp_priority: CapabilityMvpPrioritySchema,
  status: CapabilityStatusSchema,
  depends_on: z.array(CapabilityDependencySchema),
  used_by: z.array(CapabilityDependencySchema),
  owns_entities: z.array(z.string()),
  does_not_own: z.array(z.string()),
  main_processes: z.array(z.string()),
  main_events: z.array(z.string()),
  related_docs: z.array(CapabilityDocumentLinkSchema),
  boundary_risk: z.array(CapabilityBoundarySchema),
  install_state: CapabilityInstallStateSchema,
  synthetic_notes: z.string(),
}).strict();
export type CapabilityItem = Readonly<z.infer<typeof CapabilityItemSchema>>;
