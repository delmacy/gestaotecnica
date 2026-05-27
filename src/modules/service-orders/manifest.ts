import type { ModuleManifest } from "@/platform/modules";

export const serviceOrdersManifest: ModuleManifest = {
  key: "service-orders",
  name: "Service Orders",
  actions: ["service_orders.complete"],
  events: ["service_order.completed"],
  views: ["service_orders.list", "service_orders.detail"],
  dependencies: ["work-items", "assets"],
};
