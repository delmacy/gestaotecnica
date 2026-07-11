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

export const StrictModuleManifestSchemaBase = z.object({
  id: z.string({ message: "MANIFEST_MISSING_ID" }),
  key: z.string({ message: "MANIFEST_MISSING_KEY" }),
  name: z.string({ message: "MANIFEST_MISSING_NAME" }),
  description: z.string().optional(),
  actions: uniqueStringArray,
  events: uniqueStringArray,
  views: uniqueStringArray,
  dependencies: uniqueStringArray,
  version: z.string({ message: "MANIFEST_MISSING_VERSION" }).regex(/^\d+\.\d+\.\d+$/),
  capabilities: z.array(z.string(), { message: "MANIFEST_MISSING_CAPABILITIES" }).refine(items => new Set(items).size === items.length, {
    message: "Duplicates not allowed",
  }),
  lifecycleStatus: z.enum([
    "draft",
    "active",
    "deprecated",
    "retired"
  ], { message: "MANIFEST_MISSING_LIFECYCLE" }).or(z.string({ message: "MANIFEST_MISSING_LIFECYCLE" }))
});

export const StrictModuleManifestSchema = z.preprocess((val) => val, StrictModuleManifestSchemaBase);

export type StrictModuleManifest = z.infer<typeof StrictModuleManifestSchemaBase>;



export function validateStrictModuleManifest(data: unknown) {
    const errorMap = (issue: any, ctx: any) => {
      if (issue.code === 'invalid_type' && issue.received === 'undefined') {
        const p = issue.path[0];
        if (p === 'id') return { message: "MANIFEST_MISSING_ID" };
        if (p === 'key') return { message: "MANIFEST_MISSING_KEY" };
        if (p === 'name') return { message: "MANIFEST_MISSING_NAME" };
        if (p === 'version') return { message: "MANIFEST_MISSING_VERSION" };
        if (p === 'capabilities') return { message: "MANIFEST_MISSING_CAPABILITIES" };
        if (p === 'lifecycleStatus') return { message: "MANIFEST_MISSING_LIFECYCLE" };
      }
      return { message: ctx.defaultError };
    };

    const result = StrictModuleManifestSchemaBase.safeParse(data, { errorMap } as any);

    if (!result.success) {
      if (typeof data === 'object' && data !== null && !('lifecycleStatus' in data)) {
         for (const issue of result.error.issues) {
             if (issue.path[0] === 'lifecycleStatus') {
                 (issue as any).message = "MANIFEST_MISSING_LIFECYCLE";
             }
         }
      }
    }
    return result;
}
