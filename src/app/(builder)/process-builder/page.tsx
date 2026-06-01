import { BuilderPage } from "@/features/builder/process-editor/BuilderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Builder",
  description: "Construtor visual de processos da plataforma.",
};

export default function Page() {
  return <BuilderPage />;
}
