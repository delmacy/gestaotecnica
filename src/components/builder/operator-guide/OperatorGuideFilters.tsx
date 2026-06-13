"use client";

import { OperatorGuideAudience, OperatorGuideDifficulty, OperatorGuideCategory } from "./operator-guide-types";
import { Search } from "lucide-react";

interface OperatorGuideFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedAudience: string;
  onAudienceChange: (audience: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function OperatorGuideFilters({
  searchQuery,
  onSearchChange,
  selectedAudience,
  onAudienceChange,
  selectedCategory,
  onCategoryChange,
}: OperatorGuideFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div title="Busca">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
        </div>
        <input
          type="text"
          placeholder="Buscar guias..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <select
            value={selectedAudience}
            onChange={(e) => onAudienceChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-slate-700"
          >
            <option value="">Todos os Perfis</option>
            <option value="platform_builder">Platform Builder</option>
            <option value="platform_admin">Platform Admin</option>
            <option value="operator">Operator</option>
            <option value="reviewer">Reviewer</option>
            <option value="process_analyst">Process Analyst</option>
            <option value="future_workspace_owner">Workspace Owner</option>
          </select>
        </div>

        <div className="flex-1">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-sm border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white text-slate-700"
          >
            <option value="">Todas as Categorias</option>
            <option value="getting_started">Getting Started</option>
            <option value="platform_access">Platform Access</option>
            <option value="navigation">Navigation</option>
            <option value="process_mirroring">Process Mirroring</option>
            <option value="form_builder">Form Builder</option>
            <option value="view_builder">View Builder</option>
            <option value="workflow_builder">Workflow Builder</option>
            <option value="governance">Governance</option>
            <option value="troubleshooting">Troubleshooting</option>
          </select>
        </div>
      </div>
    </div>
  );
}
