import { Metadata } from "next";
import { WorkflowBuilderStudio } from "@/components/builder/workflow-builder/WorkflowBuilderStudio";

export const metadata: Metadata = {
  title: "Workflow Builder - System Builder",
  description: "Design-only mock mode for Workflow Builder.",
};

export default function WorkflowBuilderPage() {
  return (
    <main className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Workflow Builder</h1>
        <p className="text-muted-foreground mt-2">
          Design and structure capability workflows. This is a design-only view to establish operational contracts.
        </p>
      </div>

      <WorkflowBuilderStudio />
    </main>
  );
}
