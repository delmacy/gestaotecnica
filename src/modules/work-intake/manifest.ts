import type { ModuleManifest } from "@/platform/modules";

export const workIntakeManifest: ModuleManifest = {
  key: "work-intake",
  name: "Work Intake",
  actions: [
    "work_intake.capture",
    "work_intake.transition",
  ],
  events: [
    "work_intake.captured",
    "work_intake.transitioned",
  ],
  views: [
    "work_intake.list",
    "work_intake.detail",
  ],
};
