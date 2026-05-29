import type { ModuleManifest } from "@/platform/modules";

export const shiftsManifest: ModuleManifest = {
  key: "shifts",
  name: "Shifts",
  actions: ["shift_logs.add_entry", "shifts.open", "shifts.close"],
  events: ["shift_log.entry_added", "shift.opened", "shift.closed"],
  views: ["shifts.list", "shifts.detail"],
};
