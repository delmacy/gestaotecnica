"use client";

import { useState, useMemo } from "react";
import { OperatorGuideFilters } from "./OperatorGuideFilters";
import { OperatorGuideList } from "./OperatorGuideList";
import { OperatorGuideDetail } from "./OperatorGuideDetail";
import { MOCK_OPERATOR_GUIDES } from "./operator-guide-data";
import { ShieldAlert, BookOpen } from "lucide-react";

export function OperatorGuideStudio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAudience, setSelectedAudience] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  // Filtro de Guias
  const filteredGuides = useMemo(() => {
    return MOCK_OPERATOR_GUIDES.filter((guide) => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            guide.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesAudience = selectedAudience ? guide.audiences.includes(selectedAudience as any) : true;
      const matchesCategory = selectedCategory ? guide.category === selectedCategory : true;

      return matchesSearch && matchesAudience && matchesCategory;
    });
  }, [searchQuery, selectedAudience, selectedCategory]);

  const selectedGuide = useMemo(() => {
    return MOCK_OPERATOR_GUIDES.find(g => g.id === selectedGuideId) || null;
  }, [selectedGuideId]);

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Top Banner Notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-start sm:items-center gap-3">
        <div title="Notice"><ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" /></div>
        <div className="text-sm text-amber-800">
          <span className="font-semibold">Read-only / Static Guide:</span> No real operations are executed. Progress in checklists is local and temporary.
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-6 gap-6 flex-col md:flex-row">

        {/* Left Sidebar (List & Filters) */}
        <div className="w-full md:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-200px)]">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <div title="Title Icon"><BookOpen className="w-5 h-5 text-indigo-600" /></div>
              Operator Guide
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Base de conhecimento estática e mockada para operação da plataforma.
            </p>
          </div>

          <OperatorGuideFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedAudience={selectedAudience}
            onAudienceChange={setSelectedAudience}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <OperatorGuideList
            guides={filteredGuides}
            selectedGuideId={selectedGuideId}
            onSelectGuide={setSelectedGuideId}
          />
        </div>

        {/* Right Detail Panel */}
        <div className="flex-1 h-[calc(100vh-200px)] min-w-0">
          <OperatorGuideDetail guide={selectedGuide} />
        </div>

      </div>
    </div>
  );
}
