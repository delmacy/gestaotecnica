import React from "react";
import type { BuilderNode } from "../types";
import {
  StartNodePreview,
  HumanTaskNodePreview,
  FormNodePreview,
  DecisionNodePreview,
  ApprovalNodePreview,
  DocumentNodePreview,
  NotificationNodePreview,
  IntegrationNodePreview,
  EndNodePreview,
} from "./node-previews";

export type PreviewNodeRendererProps = {
  node: BuilderNode;
};

export function PreviewNodeRenderer({ node }: PreviewNodeRendererProps) {
  switch (node.type) {
    case "start":
      return <StartNodePreview node={node} />;
    case "human_task":
      return <HumanTaskNodePreview node={node} />;
    case "form":
      return <FormNodePreview node={node} />;
    case "decision":
      return <DecisionNodePreview node={node} />;
    case "approval":
      return <ApprovalNodePreview node={node} />;
    case "document":
      return <DocumentNodePreview node={node} />;
    case "notification":
      return <NotificationNodePreview node={node} />;
    case "integration":
      return <IntegrationNodePreview node={node} />;
    case "end":
      return <EndNodePreview node={node} />;
    default:
      return (
        <div className="p-4 border border-dashed border-red-300 bg-red-50 text-red-700 text-sm rounded">
          Bloco de preview não implementado para o tipo: <strong>{node.type}</strong>
        </div>
      );
  }
}
