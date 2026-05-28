import type { ModuleManifest } from "@/platform/modules";

export const dashboardManifest: ModuleManifest = {
  key: "dashboard",
  name: "Dashboard",
  actions: ["dashboard.get_summary"],
  views: ["dashboard.main"],
};
