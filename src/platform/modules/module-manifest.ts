import { z } from "zod";

export const ModuleLifecycleStatusSchema = z.enum([
  "draft",
  "active",
  "deprecated",
  "retired"
]).or(z.string());

export type ModuleLifecycleStatus = z.infer<typeof ModuleLifecycleStatusSchema>;

export type ModuleManifest = {
  key: string;
  name: string;
  description?: string;
  actions?: string[];
  events?: string[];
  views?: string[];
  dependencies?: string[];
  lifecycleStatus?: ModuleLifecycleStatus;
};
