"use client";

import React from "react";
import { useBuilderEditorState } from "../state/use-builder-editor-state";
import { BuilderLayout } from "./BuilderLayout";
import { BlockLibraryPanel } from "../block-library/BlockLibraryPanel";
import { InspectorPanel } from "../inspector-panel/InspectorPanel";
import { BuilderCanvas } from "../canvas/BuilderCanvas";
import { BuilderValidationPanel } from "../validation/BuilderValidationPanel";
import { BuilderDraftActionsPanel } from "../draft-actions";

export function BuilderPage() {
  const editor = useBuilderEditorState();

  return (
    <BuilderLayout
      blockLibrary={<BlockLibraryPanel onAddNode={editor.actions.addNode} />}
      canvas={<BuilderCanvas state={editor.state} actions={editor.actions} />}
      inspector={<InspectorPanel state={editor.state} actions={editor.actions} />}
      validation={<BuilderValidationPanel draft={editor.state.draft} />}
      draftActions={<BuilderDraftActionsPanel state={editor.state} actions={editor.actions} />}
      headerInfo={{
        name: editor.state.draft.name,
        status: editor.state.draft.status,
        isDirty: editor.state.dirty,
        nodeCount: editor.state.draft.nodes.length,
        edgeCount: editor.state.draft.edges.length,
      }}
    />
  );
}
