import { GovernanceMatrixStudio } from "@/components/builder/governance-matrix/GovernanceMatrixStudio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Governance Matrix Studio | System Builder",
  description: "Design-only mock surface for governance contracts.",
};

export default function GovernanceMatrixPage() {
  return (
    <div className="h-full w-full bg-slate-50/50 flex flex-col">
      <GovernanceMatrixStudio />
    </div>
  );
}
