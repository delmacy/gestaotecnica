import type { ModuleManifest } from "@/platform/modules";

export const workspaceConfigManifest: ModuleManifest = {
  key: "workspace-config",
  name: "Workspace Configuration",
  actions: ["workspace.toggle_module"],
  views: ["workspace.settings"],
};
