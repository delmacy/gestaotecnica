import type { ModuleManifest } from "@/platform/modules";

export const workItemsManifest: ModuleManifest = {
  key: "work-items",
  name: "Work Items",
  actions: ["work_items.create", "work_items.transition"],
  events: ["work_item.created", "work_item.transitioned"],
  views: ["work_items.list", "work_items.detail"],
};
