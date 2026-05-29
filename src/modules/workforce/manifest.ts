import type { ModuleManifest } from "@/platform/modules";

export const workforceManifest: ModuleManifest = {
  key: "workforce",
  name: "Workforce",
  actions: ["workforce.create_technician", "workforce.create_team"],
  events: ["workforce.technician_created", "workforce.team_created"],
  views: ["workforce.list", "workforce.teams"],
};
