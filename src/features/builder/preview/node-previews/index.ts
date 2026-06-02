import type { BuilderNode } from "../../types";

export type NodePreviewProps = {
  node: BuilderNode;
};

export * from "./StartNodePreview";
export * from "./HumanTaskNodePreview";
export * from "./FormNodePreview";
export * from "./DecisionNodePreview";
export * from "./ApprovalNodePreview";
export * from "./DocumentNodePreview";
export * from "./NotificationNodePreview";
export * from "./IntegrationNodePreview";
export * from "./EndNodePreview";
