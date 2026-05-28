import type { ModuleManifest } from "@/platform/modules";

export const inventoryManifest: ModuleManifest = {
  key: "inventory",
  name: "Inventory",
  actions: ["inventory.adjust_stock"],
  events: ["inventory.stock_adjusted"],
  views: ["inventory.list", "inventory.detail"],
};
