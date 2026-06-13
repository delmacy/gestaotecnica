import { OperatorGuideStudio } from "@/components/builder/operator-guide/OperatorGuideStudio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operator Guide | System Builder",
  description: "Guia operacional da plataforma System Builder",
};

export default function OperatorGuidePage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-hidden">
      <OperatorGuideStudio />
    </div>
  );
}
