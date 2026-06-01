"use client";

import React from "react";
import { useBuilderEditorState } from "../state/use-builder-editor-state";
import { BuilderLayout } from "./BuilderLayout";
import { BuilderCanvasPlaceholder } from "./BuilderCanvasPlaceholder";
import { BlockLibraryPanel } from "../block-library/BlockLibraryPanel";
import { InspectorPanel } from "../inspector-panel/InspectorPanel";

export function BuilderPage() {
  const editor = useBuilderEditorState();

  return (
    <BuilderLayout
      blockLibrary={<BlockLibraryPanel onAddNode={editor.actions.addNode} />}
      canvas={<BuilderCanvasPlaceholder state={editor.state} actions={editor.actions} />}
      inspector={<InspectorPanel state={editor.state} actions={editor.actions} />}
    />
  );
}
