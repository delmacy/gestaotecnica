"use client";

import { useState, useMemo } from "react";
import { createEmptyBuilderDraft } from "../process-editor/create-empty-builder-draft";
import { getBuilderBlockDefinition } from "../block-library/block-catalog";
import type { BuilderEditorState, BuilderEditorActions, AddBuilderNodeInput } from "./builder-editor-state";
import type { BuilderId, BuilderNode, BuilderEdge } from "../types";

export function useBuilderEditorState() {
  const [state, setState] = useState<BuilderEditorState>(() => ({
    draft: createEmptyBuilderDraft(),
    dirty: false,
  }));

  const actions = useMemo<BuilderEditorActions>(() => {
    return {
      addNode: (input: AddBuilderNodeInput) => {
        setState((prev) => {
          const definition = getBuilderBlockDefinition(input.type);
          if (!definition) return prev;

          const newNodeId = typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString();

          const offsetMultiplier = prev.draft.nodes.length;

          const newNode: BuilderNode = {
            id: newNodeId,
            type: input.type,
            label: input.label ?? definition.label,
            description: input.description,
            position: {
              x: 120 + offsetMultiplier * 40,
              y: 120 + offsetMultiplier * 40,
            },
            config: definition.defaultConfig,
            metadata: {},
          };

          return {
            ...prev,
            draft: {
              ...prev.draft,
              nodes: [...prev.draft.nodes, newNode],
            },
            dirty: true,
            selectedNodeId: newNodeId,
            selectedEdgeId: undefined,
          };
        });
      },

      selectNode: (nodeId: BuilderId) => {
        setState((prev) => ({
          ...prev,
          selectedNodeId: nodeId,
          selectedEdgeId: undefined,
        }));
      },

      clearSelection: () => {
        setState((prev) => ({
          ...prev,
          selectedNodeId: undefined,
          selectedEdgeId: undefined,
        }));
      },

      updateSelectedNode: (patch: Partial<Pick<BuilderNode, "label" | "description" | "config">>) => {
        setState((prev) => {
          if (!prev.selectedNodeId) return prev;

          const updatedNodes = prev.draft.nodes.map((node) => {
            if (node.id === prev.selectedNodeId) {
              return {
                ...node,
                ...patch,
              };
            }
            return node;
          });

          return {
            ...prev,
            draft: {
              ...prev.draft,
              nodes: updatedNodes,
            },
            dirty: true,
          };
        });
      },

      updateNodePositions: (nodes: BuilderNode[]) => {
        setState((prev) => ({
          ...prev,
          draft: {
            ...prev.draft,
            nodes,
          },
          dirty: true,
        }));
      },

      addEdge: (edge: BuilderEdge) => {
        setState((prev) => {
          const exists = prev.draft.edges.some(
            (e) =>
              e.source === edge.source &&
              e.target === edge.target &&
              e.sourceHandle === edge.sourceHandle &&
              e.targetHandle === edge.targetHandle
          );

          if (exists) return prev;

          return {
            ...prev,
            draft: {
              ...prev.draft,
              edges: [...prev.draft.edges, edge],
            },
            dirty: true,
          };
        });
      },
    };
  }, []);

  return { state, actions };
}
