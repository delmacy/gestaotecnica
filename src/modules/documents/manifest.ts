import type { ModuleManifest } from "@/platform/modules";

export const documentsManifest: ModuleManifest = {
  key: "documents",
  name: "Documents",
  actions: ["documents.generate", "documents.transition"],
  events: ["document.generated", "document.status_changed"],
  views: ["documents.list"],
};
