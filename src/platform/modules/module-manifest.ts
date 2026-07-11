import { z } from "zod";
import { SchemaVersionSchema, UnknownRecordSchema } from "../contracts/payload";

export const ModuleLifecycleStatusSchema = z.enum([
  "draft",
  "active",
  "deprecated",
  "retired"
]).or(z.string());

export type ModuleLifecycleStatus = z.infer<typeof ModuleLifecycleStatusSchema>;

const uniqueStringArray = z.array(z.string()).refine(items => new Set(items).size === items.length, {
  message: "Duplicates not allowed",
}).optional();

export const ModuleManifestSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  actions: uniqueStringArray,
  events: uniqueStringArray,
  views: uniqueStringArray,
  dependencies: uniqueStringArray,
  lifecycleStatus: ModuleLifecycleStatusSchema.optional()
});

export type ModuleManifest = z.infer<typeof ModuleManifestSchema>;

export const StrictModuleManifestSchema = ModuleManifestSchema.extend({
  id: z.string({
    message: "MISSING_MANIFEST_ID"
  }).min(1, { message: "EMPTY_MANIFEST_ID" }),

  name: z.string({
    message: "MISSING_MANIFEST_NAME"
  }),

  version: z.unknown().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "MISSING_MANIFEST_VERSION" });
      return z.NEVER;
    }
    const result = SchemaVersionSchema.safeParse(val);
    if (!result.success) {
      result.error.issues.forEach(i => ctx.addIssue(i as z.IssueData));
      return z.NEVER;
    }
  }).transform(val => val as string),

  capabilities: z.array(z.string(), {
    message: "MISSING_MANIFEST_CAPABILITIES"
  }),

  lifecycleMetadata: z.unknown().superRefine((val, ctx) => {
    if (val === undefined) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "MISSING_LIFECYCLE_METADATA" });
      return z.NEVER;
    }
    const result = UnknownRecordSchema.safeParse(val);
    if (!result.success) {
      result.error.issues.forEach(i => ctx.addIssue(i as z.IssueData));
      return z.NEVER;
    }
  }).transform(val => val as Record<string, unknown>)
});

export type StrictModuleManifest = z.infer<typeof StrictModuleManifestSchema>;
