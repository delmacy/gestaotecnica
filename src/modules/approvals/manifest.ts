import type { ModuleManifest } from "@/platform/modules";

export const approvalsManifest: ModuleManifest = {
  key: "approvals",
  name: "Approvals",
  actions: ["approvals.request", "approvals.decide"],
  events: ["approval.requested", "approval.decided"],
  views: ["approvals.list"],
  dependencies: ["service-orders"],
};
