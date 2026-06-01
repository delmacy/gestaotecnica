import type {
  BuilderConnectionHandle,
  BuilderId,
  BuilderMetadata,
  BuilderPosition,
} from "./builder.types";

export type BuilderBlockType =
  | "start"
  | "human_task"
  | "form"
  | "decision"
  | "approval"
  | "document"
  | "notification"
  | "integration"
  | "end";

export type BuilderBlockCategory =
  | "flow"
  | "human"
  | "data"
  | "automation"
  | "document"
  | "integration";

export type BuilderNodeConfig = BuilderMetadata;

export type BuilderEdgeConfig = BuilderMetadata;

export type BuilderBlockDefinition = {
  type: BuilderBlockType;
  category: BuilderBlockCategory;
  label: string;
  description: string;
  defaultConfig: BuilderNodeConfig;
  inputs: BuilderConnectionHandle[];
  outputs: BuilderConnectionHandle[];
};

export type BuilderNode = {
  id: BuilderId;
  type: BuilderBlockType;
  label: string;
  description?: string;
  position: BuilderPosition;
  config: BuilderNodeConfig;
  metadata?: BuilderMetadata;
};

export type BuilderEdge = {
  id: BuilderId;
  source: BuilderId;
  target: BuilderId;
  sourceHandle?: BuilderId;
  targetHandle?: BuilderId;
  label?: string;
  condition?: BuilderMetadata;
  config?: BuilderEdgeConfig;
  metadata?: BuilderMetadata;
};
