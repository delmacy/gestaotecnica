import type { ModuleManifest } from "@/platform/modules";

export const globalSearchManifest: ModuleManifest = {
  key: "global-search",
  name: "Global Search",
  actions: ["search.everything"],
  views: ["search.results"],
};
