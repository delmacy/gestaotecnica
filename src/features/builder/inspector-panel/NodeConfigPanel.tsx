import React from "react";
import type { BuilderNode } from "../types";
import type { BuilderEditorActions } from "../state";
import {
  StartNodeConfig,
  HumanTaskNodeConfig,
  FormNodeConfig,
  DecisionNodeConfig,
  ApprovalNodeConfig,
  DocumentNodeConfig,
  NotificationNodeConfig,
  IntegrationNodeConfig,
  EndNodeConfig,
} from "./node-configs";

export type NodeConfigPanelProps = {
  node: BuilderNode;
  actions: BuilderEditorActions;
};

export function NodeConfigPanel({ node, actions }: NodeConfigPanelProps) {
  switch (node.type) {
    case "start":
      return <StartNodeConfig node={node} actions={actions} />;
    case "human_task":
      return <HumanTaskNodeConfig node={node} actions={actions} />;
    case "form":
      return <FormNodeConfig node={node} actions={actions} />;
    case "decision":
      return <DecisionNodeConfig node={node} actions={actions} />;
    case "approval":
      return <ApprovalNodeConfig node={node} actions={actions} />;
    case "document":
      return <DocumentNodeConfig node={node} actions={actions} />;
    case "notification":
      return <NotificationNodeConfig node={node} actions={actions} />;
    case "integration":
      return <IntegrationNodeConfig node={node} actions={actions} />;
    case "end":
      return <EndNodeConfig node={node} actions={actions} />;
    default:
      return null;
  }
}
