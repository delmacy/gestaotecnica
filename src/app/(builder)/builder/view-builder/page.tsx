import { Metadata } from "next";
import { ViewBuilderStudio } from "@/components/builder/view-builder/ViewBuilderStudio";

export const metadata: Metadata = {
  title: "View Builder | System Builder",
  description: "Superfície mockada de design-only para views.",
};

export default function ViewBuilderPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b px-6 py-3 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-bold text-gray-800">View Builder Studio</h1>
          <p className="text-sm text-gray-500">Design and simulate visual views (Mock Mode)</p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold tracking-wider text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full uppercase border border-yellow-200">
              Design Only
            </span>
            <span className="text-xs text-gray-400 mt-0.5">Not connected to runtime</span>
          </div>
        </div>
      </div>
      <ViewBuilderStudio />
    </div>
  );
}
