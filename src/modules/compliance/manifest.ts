import type { ModuleManifest } from "@/platform/modules";

export const complianceManifest: ModuleManifest = {
  key: "compliance",
  name: "Compliance",
  actions: ["compliance.create_audit"],
  events: ["compliance.audit_created"],
  views: ["compliance.audits", "compliance.findings"],
};
