import type { WorkspaceContext } from "@/platform/workspace";
import type { ModuleManifest } from "./module-manifest";

const modules = new Map<string, ModuleManifest>();

export function registerModule(manifest: ModuleManifest) {
  const existing = modules.get(manifest.key);
  if (existing) return existing;
  modules.set(manifest.key, manifest);
  return manifest;
}

export function getModule(moduleKey: string) {
  return modules.get(moduleKey);
}

export function listModules() {
  return Array.from(modules.values());
}

export function isModuleEnabled(context: WorkspaceContext, moduleKey: string) {
  return context.enabledModules.includes(moduleKey);
}
