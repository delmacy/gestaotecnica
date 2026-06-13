"use client";

import { OperatorGuide } from "./operator-guide-types";
import { Book, FileText } from "lucide-react";

interface OperatorGuideListProps {
  guides: OperatorGuide[];
  selectedGuideId: string | null;
  onSelectGuide: (id: string) => void;
}

export function OperatorGuideList({
  guides,
  selectedGuideId,
  onSelectGuide,
}: OperatorGuideListProps) {
  if (guides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-slate-400 bg-slate-50/50 rounded-md border border-slate-200 border-dashed">
        <div title="Empty">
          <Book className="w-8 h-8 mb-2 opacity-50" />
        </div>
        <p className="text-sm">Nenhum guia encontrado com os filtros atuais.</p>
      </div>
    );
  }

  // Agrupar guias por categoria (para simplificar, no MVP apenas listamos com estilo visual diferente)
  return (
    <div className="space-y-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
      {guides.map((guide) => {
        const isSelected = selectedGuideId === guide.id;

        let difficultyColor = "bg-slate-100 text-slate-600";
        if (guide.difficulty === "beginner") difficultyColor = "bg-green-100 text-green-700";
        if (guide.difficulty === "intermediate") difficultyColor = "bg-blue-100 text-blue-700";
        if (guide.difficulty === "advanced") difficultyColor = "bg-purple-100 text-purple-700";
        if (guide.difficulty === "reference") difficultyColor = "bg-amber-100 text-amber-700";

        return (
          <button
            key={guide.id}
            onClick={() => onSelectGuide(guide.id)}
            className={`w-full text-left p-3 rounded-md transition-all flex items-start gap-3 border ${
              isSelected
                ? "bg-indigo-50 border-indigo-200 shadow-sm"
                : "bg-white border-transparent hover:bg-slate-50 hover:border-slate-200"
            }`}
          >
            <div className={`mt-0.5 ${isSelected ? "text-indigo-500" : "text-slate-400"}`}>
               <div title="Icon">
                  <FileText className="w-4 h-4" />
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium truncate ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>
                {guide.title}
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-xs text-slate-500 capitalize truncate block max-w-[120px]">
                  {guide.category.replace("_", " ")}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${difficultyColor}`}>
                  {guide.difficulty}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
