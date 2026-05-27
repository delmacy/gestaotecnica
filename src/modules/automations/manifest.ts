import type { ModuleManifest } from "@/platform/modules";

export const automationsManifest: ModuleManifest = {
  key: "automations",
  name: "Automations",
  actions: ["automations.run"],
  events: ["automation_rule.executed"],
  views: ["automations.list"],
  dependencies: ["events"],
};
