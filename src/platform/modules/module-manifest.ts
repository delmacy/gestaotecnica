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
