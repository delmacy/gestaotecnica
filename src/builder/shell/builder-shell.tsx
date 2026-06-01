import { ReactNode } from "react";
import { Explorer } from "./explorer";
import { Canvas } from "./canvas";
import { Inspector } from "./inspector";

export default function BuilderShell() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Explorer />
      <div className="flex-1 overflow-auto">
        <Canvas />
      </div>
      <Inspector />
    </div>
  );
}
