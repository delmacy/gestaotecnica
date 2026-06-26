import type { ModuleManifest } from "@/platform/modules";

export const caseManagementManifest: ModuleManifest = {
  key: "case-management",
  name: "Case Management",
  actions: [
    "case_management.create",
    "case_management.update",
    "case_management.change_status",
    "case_management.add_comment",
  ],
  events: [
    "case_management.created",
    "case_management.updated",
    "case_management.status_changed",
    "case_management.comment_added",
  ],
  views: [
    "case_management.list",
    "case_management.detail",
    "case_management.form",
  ],
};
