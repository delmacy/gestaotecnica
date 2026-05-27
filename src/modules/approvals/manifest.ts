import type { ModuleManifest } from "@/platform/modules";

export const approvalsManifest: ModuleManifest = {
  key: "approvals",
  name: "Approvals",
  actions: ["approvals.request"],
  events: ["approval.requested"],
  views: ["approvals.list"],
  dependencies: ["service-orders"],
};
