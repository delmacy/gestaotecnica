import type { ModuleManifest } from "@/platform/modules";

export const workforceManifest: ModuleManifest = {
  key: "workforce",
  name: "Workforce",
  actions: [
    "workforce.create_technician",
    "workforce.create_team",
    "workforce.create_unavailability"
  ],
  events: [
    "workforce.member_created",
    "workforce.team_created",
    "workforce.unavailability_created"
  ],
  views: ["workforce.list", "workforce.detail", "workforce.teams"],
};
