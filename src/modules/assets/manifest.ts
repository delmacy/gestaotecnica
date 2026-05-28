import type { ModuleManifest } from "@/platform/modules";

export const assetsManifest: ModuleManifest = {
  key: "assets",
  name: "Assets",
  actions: ["assets.create", "assets.update_status"],
  events: ["asset.created", "asset.status_changed"],
  views: ["assets.list", "assets.detail"],
};
