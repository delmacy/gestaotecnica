import type { ModuleManifest } from "@/platform/modules";

export const evidencesManifest: ModuleManifest = {
  key: "evidences",
  name: "Evidences",
  actions: ["evidences.attach"],
  events: ["evidence.attached"],
  views: ["evidences.list"],
};
