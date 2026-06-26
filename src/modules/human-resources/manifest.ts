import type { ModuleManifest } from "@/platform/modules";

export const hrManifest: ModuleManifest = {
  key: "human-resources",
  name: "Human Resources",
  actions: [
    "hr.employee.create",
    "hr.employee.update",
  ],
  events: [
    "hr.employee.created",
    "hr.employee.updated",
  ],
  views: [
    "hr.employee.list",
    "hr.employee.detail",
  ],
};
