import { z } from "zod";

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



const strictErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type && issue.received === "undefined") {
    const p = issue.path[0];
    switch (p) {
      case "id": return { message: "MANIFEST_MISSING_ID" };
      case "key": return { message: "MANIFEST_MISSING_KEY" };
      case "name": return { message: "MANIFEST_MISSING_NAME" };
      case "version": return { message: "MANIFEST_MISSING_VERSION" };
      case "capabilities": return { message: "MANIFEST_MISSING_CAPABILITIES" };
      case "lifecycleStatus": return { message: "MANIFEST_MISSING_LIFECYCLE" };
    }
  }
  return { message: ctx.defaultError };
};

export const StrictModuleManifestSchemaBase = ModuleManifestSchema.extend({
  id: z.string({ required_error: "MANIFEST_MISSING_ID" }),
  key: z.string({ required_error: "MANIFEST_MISSING_KEY" }),
  name: z.string({ required_error: "MANIFEST_MISSING_NAME" }),
  version: z.string({ required_error: "MANIFEST_MISSING_VERSION" }).regex(/^\d+\.\d+\.\d+$/),
  capabilities: z.array(z.string(), { required_error: "MANIFEST_MISSING_CAPABILITIES" }).refine(items => new Set(items).size === items.length, {
    message: "Duplicates not allowed",
  }),
  lifecycleStatus: z.enum([
    "draft",
    "active",
    "deprecated",
    "retired"
  ], { required_error: "MANIFEST_MISSING_LIFECYCLE" }).or(z.string({ required_error: "MANIFEST_MISSING_LIFECYCLE" }))
});

export const StrictModuleManifestSchema = z.preprocess(
  (val) => val,
  StrictModuleManifestSchemaBase
);

export type StrictModuleManifest = z.infer<typeof StrictModuleManifestSchemaBase>;

// Re-wrap parse with error map for edge cases where union throws differently
export function validateStrictModuleManifest(data: unknown) {
    return StrictModuleManifestSchemaBase.safeParse(data, { errorMap: strictErrorMap });
}
