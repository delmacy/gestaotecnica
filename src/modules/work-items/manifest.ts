import type { ModuleManifest } from "@/platform/modules";

export const workItemsManifest: ModuleManifest = {
  key: "work-items",
  name: "Work Items",
  actions: ["work_items.create"],
  events: ["work_item.created"],
  views: ["work_items.list", "work_items.detail"],
};
