import type { ModuleManifest } from "@/platform/modules";

export const legacyManifest: ModuleManifest = {
  key: "legacy",
  name: "Legacy Records",
  actions: ["legacy_records.create"],
  events: ["legacy_record.created"],
  views: ["legacy.list"],
};
