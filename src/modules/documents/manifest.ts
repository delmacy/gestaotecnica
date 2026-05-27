import type { ModuleManifest } from "@/platform/modules";

export const documentsManifest: ModuleManifest = {
  key: "documents",
  name: "Documents",
  actions: ["documents.generate"],
  events: ["document.generated"],
  views: ["documents.list"],
};
