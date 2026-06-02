"use client";

import { useState, useMemo } from "react";
import { createEmptyBuilderDraft } from "../process-editor/create-empty-builder-draft";
import { getBuilderBlockDefinition } from "../block-library/block-catalog";
import type { BuilderEditorState, BuilderEditorActions, AddBuilderNodeInput } from "./builder-editor-state";
import type { BuilderId, BuilderNode, BuilderEdge, BuilderDraft } from "../types";

export function useBuilderEditorState() {
  const [state, setState] = useState<BuilderEditorState>(() => ({
    draft: createEmptyBuilderDraft(),
    dirty: false,
    localPersistence: {
      restored: false,
    },
    mode: "builder",
    preview: {
      completedNodeIds: [],
    },
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

      renameDraft: (input: { name: string; description?: string }) => {
        setState((prev) => ({
          ...prev,
          draft: {
            ...prev.draft,
            name: input.name,
            description: input.description,
            updatedAt: new Date().toISOString(),
          },
          dirty: true,
        }));
      },

      resetDraft: () => {
        setState((prev) => ({
          ...prev,
          draft: createEmptyBuilderDraft(),
          selectedNodeId: undefined,
          selectedEdgeId: undefined,
          dirty: false,
        }));
      },

      replaceDraft: (draft: BuilderDraft) => {
        setState((prev) => ({
          ...prev,
          draft,
          selectedNodeId: undefined,
          selectedEdgeId: undefined,
          dirty: true,
        }));
      },

      markClean: () => {
        setState((prev) => ({
          ...prev,
          dirty: false,
        }));
      },

      setLocalPersistenceStatus: (input: {
        restored?: boolean;
        lastSavedAt?: string;
        message?: string;
      }) => {
        setState((prev) => ({
          ...prev,
          localPersistence: {
            ...prev.localPersistence,
            ...input,
            restored: input.restored ?? prev.localPersistence?.restored ?? false,
          },
        }));
      },

      setMode: (mode: "builder" | "preview") => {
        setState((prev) => ({
          ...prev,
          mode,
        }));
      },

      setPreviewActiveNode: (nodeId?: BuilderId) => {
        setState((prev) => ({
          ...prev,
          preview: {
            completedNodeIds: prev.preview?.completedNodeIds ?? [],
            ...prev.preview,
            activeNodeId: nodeId,
          },
        }));
      },

      completePreviewStep: (nodeId: BuilderId) => {
        setState((prev) => {
          const completed = prev.preview?.completedNodeIds ?? [];
          return {
            ...prev,
            preview: {
              ...prev.preview,
              completedNodeIds: completed.includes(nodeId)
                ? completed
                : [...completed, nodeId],
            },
          };
        });
      },

      resetPreview: () => {
        setState((prev) => ({
          ...prev,
          preview: {
            activeNodeId: undefined,
            completedNodeIds: [],
          },
        }));
      },
    };
  }, []);

  return { state, actions };
}
