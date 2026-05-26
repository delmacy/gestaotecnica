import type { activeAdaptation } from "@/adaptations/active";

export type ActiveWorkspaceAdaptation = typeof activeAdaptation;

export type WorkspaceModuleConfig = {
  key: string;
  name: string;
  description: string;
  layer: "platform" | "module" | "adaptation";
  status: "implemented" | "adjusted" | "planned";
};
