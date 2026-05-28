import type { ModuleManifest } from "@/platform/modules";

export const maintenancePlansManifest: ModuleManifest = {
  key: "maintenance-plans",
  name: "Maintenance Plans",
  actions: ["maintenance_plans.create", "maintenance_plans.generate_order"],
  events: ["maintenance_plan.created", "maintenance_plan.order_generated"],
  views: ["maintenance_plans.list"],
};
