import type { ModuleManifest } from "@/platform/modules";

export const reportsManifest: ModuleManifest = {
  key: "reports",
  name: "Reports",
  actions: ["reports.generate_operational"],
  events: ["report.generated"],
  views: ["reports.list"],
};
