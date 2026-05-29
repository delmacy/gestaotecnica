import type { ModuleManifest } from "@/platform/modules";

export const schedulesManifest: ModuleManifest = {
  key: "schedules",
  name: "Schedules",
  actions: ["schedules.create"],
  events: ["schedule.created"],
  views: ["schedules.calendar"],
};
