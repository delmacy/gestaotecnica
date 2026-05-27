import type { ModuleManifest } from "@/platform/modules";

export const assetsManifest: ModuleManifest = {
  key: "assets",
  name: "Assets",
  actions: ["assets.create"],
  events: ["asset.created"],
  views: ["assets.list", "assets.detail"],
};
