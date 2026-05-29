"use client";

import { useState } from "react";
import { BuilderExplorer } from "@/components/builder/explorer";
import { BuilderCanvas } from "@/components/builder/canvas";
import { BuilderInspector } from "@/components/builder/inspector";

export default function BuilderPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <>
      {/* 1. Explorer (Left) */}
      <BuilderExplorer
        selectedId={selectedItem?.id}
        onSelect={(item) => setSelectedItem(item)}
      />

      {/* 2. Main Workspace (Center) */}
      <BuilderCanvas activeItem={selectedItem} />

      {/* 3. Inspector (Right) */}
      <BuilderInspector selectedItem={selectedItem} />
    </>
  );
}
