import type { BuilderNode } from "../../types";
import type { BuilderEditorActions } from "../../state";

export type NodeConfigComponentProps = {
  node: BuilderNode;
  actions: BuilderEditorActions;
};

export * from "./StartNodeConfig";
export * from "./HumanTaskNodeConfig";
export * from "./FormNodeConfig";
export * from "./DecisionNodeConfig";
export * from "./ApprovalNodeConfig";
export * from "./DocumentNodeConfig";
export * from "./NotificationNodeConfig";
export * from "./IntegrationNodeConfig";
export * from "./EndNodeConfig";
