import type { ModuleManifest } from "@/platform/modules";

export const notificationsManifest: ModuleManifest = {
  key: "notifications",
  name: "Notifications",
  actions: ["notifications.send"],
  events: ["notification.sent"],
  views: [],
};
