import type { ModuleManifest } from "@/platform/modules";

export const shiftsManifest: ModuleManifest = {
  key: "shifts",
  name: "Shifts",
  actions: ["shift_logs.add_entry"],
  events: ["shift_log.entry_added"],
  views: ["shifts.list", "shifts.detail"],
};
