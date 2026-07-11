import { z } from "zod";
import { EntityIdSchema } from "../../contracts/identifiers";
import { SchemaVersionSchema } from "../../contracts/payload";
import { CAPABILITY_DOMAINS, CAPABILITY_GROUPS } from "./constants";


/**
 * Manifest Version
 */
export const ManifestVersionSchema = SchemaVersionSchema;
export type ManifestVersion = z.infer<typeof ManifestVersionSchema>;

/**
 * Capability Status
 */
export const CapabilityStatusSchema = z.enum([
  "draft",
  "active",
  "deprecated",
  "retired"
]);
export type CapabilityStatus = z.infer<typeof CapabilityStatusSchema>;

/**
 * Capability Lifecycle Transition
 */
export const CapabilityLifecycleTransitionSchema = z.object({
  from: CapabilityStatusSchema,
  to: CapabilityStatusSchema,
});
export type CapabilityLifecycleTransition = z.infer<typeof CapabilityLifecycleTransitionSchema>;

/**
 * Business Object - Represents a core entity the capability interacts with
 */
export const BusinessObjectSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type BusinessObject = z.infer<typeof BusinessObjectSchema>;

/**
 * Business Action - Represents an operation provided by the capability
 */
export const BusinessActionSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type BusinessAction = z.infer<typeof BusinessActionSchema>;

/**
 * Business Event - Represents an event emitted by the capability
 */
export const BusinessEventSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type BusinessEvent = z.infer<typeof BusinessEventSchema>;

/**
 * Business Rule - Represents a constraint or logic requirement
 */
export const BusinessRuleSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
});
export type BusinessRule = z.infer<typeof BusinessRuleSchema>;

/**
 * Business Role - Represents a responsibility required for the capability
 */
export const BusinessRoleSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type BusinessRole = z.infer<typeof BusinessRoleSchema>;

/**
 * Process Template Reference - Reference to a standard process template
 */
export const ProcessTemplateReferenceSchema = z.object({
  templateId: EntityIdSchema,
  version: ManifestVersionSchema.optional(),
});
export type ProcessTemplateReference = z.infer<typeof ProcessTemplateReferenceSchema>;

/**
 * Data Requirement - Defines a piece of data needed by the capability
 */
export const DataRequirementSchema = z.object({
  key: z.string().min(1),
  type: z.string(),
  required: z.boolean().default(true),
  description: z.string().optional(),
});
export type DataRequirement = z.infer<typeof DataRequirementSchema>;

/**
 * Integration Requirement - Defines an external integration need
 */
export const IntegrationRequirementSchema = z.object({
  key: z.string().min(1),
  systemType: z.string(),
  description: z.string().optional(),
});
export type IntegrationRequirement = z.infer<typeof IntegrationRequirementSchema>;

/**
 * Compliance Requirement - Defines a regulatory or standard compliance need
 */
export const ComplianceRequirementSchema = z.object({
  key: z.string().min(1),
  standard: z.string(),
  description: z.string().optional(),
});
export type ComplianceRequirement = z.infer<typeof ComplianceRequirementSchema>;

/**
 * Capability Domain
 */
const DOMAIN_VALUES = Object.values(CAPABILITY_DOMAINS) as [string, ...string[]];
export const CapabilityDomainSchema = z.enum(DOMAIN_VALUES);
export type CapabilityDomain = z.infer<typeof CapabilityDomainSchema>;

/**
 * Capability Group
 */
const GROUP_VALUES = Object.values(CAPABILITY_GROUPS) as [string, ...string[]];
export const CapabilityGroupSchema = z.enum(GROUP_VALUES);
export type CapabilityGroup = z.infer<typeof CapabilityGroupSchema>;

/**
 * Helper to validate unique keys in arrays
 */
const uniqueKeyRefinement = (arr: { key: string }[]) => {
  const keys = arr.map(item => item.key);
  return new Set(keys).size === keys.length;
};

const uniqueKeyMessage = (path: string) => ({
  message: `Duplicate keys found in ${path}`,
});

/**
 * Capability Schema
 */
export const CapabilitySchema = z.object({
  id: EntityIdSchema,
  key: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  domain: CapabilityDomainSchema,
  group: CapabilityGroupSchema,
  version: ManifestVersionSchema,
  status: CapabilityStatusSchema,
  businessObjects: z.array(BusinessObjectSchema).min(1).refine(uniqueKeyRefinement, uniqueKeyMessage("businessObjects")),
  businessActions: z.array(BusinessActionSchema).min(1).refine(uniqueKeyRefinement, uniqueKeyMessage("businessActions")),
  businessEvents: z.array(BusinessEventSchema).default([]).refine(uniqueKeyRefinement, uniqueKeyMessage("businessEvents")),
  businessRules: z.array(BusinessRuleSchema).default([]).refine(uniqueKeyRefinement, uniqueKeyMessage("businessRules")),
  roles: z.array(BusinessRoleSchema).default([]).refine(uniqueKeyRefinement, uniqueKeyMessage("roles")),
  inputs: z.array(DataRequirementSchema).default([]).refine(uniqueKeyRefinement, uniqueKeyMessage("inputs")),
  outputs: z.array(DataRequirementSchema).default([]).refine(uniqueKeyRefinement, uniqueKeyMessage("outputs")),
  dependencies: z.array(z.string()).default([]),
  relatedCapabilities: z.array(z.string()).default([]),
  applicableSectors: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type Capability = z.infer<typeof CapabilitySchema>;

/**
 * Capability Catalog Index Schema
 */
export const CapabilityCatalogIndexSchema = z.object({
  version: ManifestVersionSchema,
  lastUpdated: z.string().datetime(),
  capabilities: z.array(CapabilitySchema),
});

export type CapabilityCatalogIndex = z.infer<typeof CapabilityCatalogIndexSchema>;
