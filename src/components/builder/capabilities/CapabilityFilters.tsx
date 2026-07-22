import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CapabilityCategory, CapabilityMvpPriority, CapabilityStatus } from "./capability-types";

interface CapabilityFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoryFilter: CapabilityCategory | "all";
  setCategoryFilter: (category: CapabilityCategory | "all") => void;
  priorityFilter: CapabilityMvpPriority | "all";
  setPriorityFilter: (priority: CapabilityMvpPriority | "all") => void;
  statusFilter: CapabilityStatus | "all";
  setStatusFilter: (status: CapabilityStatus | "all") => void;
  onClear: () => void;
}

export function CapabilityFilters({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  statusFilter,
  setStatusFilter,
  onClear
}: CapabilityFiltersProps) {

  const hasActiveFilters =
    searchTerm !== "" ||
    categoryFilter !== "all" ||
    priorityFilter !== "all" ||
    statusFilter !== "all";

  return (
    <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-end">
      <div className="flex-1">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Busca</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou slug..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="w-full md:w-48">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Categoria</label>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as CapabilityCategory | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            <SelectItem value="foundation">Fundacao</SelectItem>
            <SelectItem value="work-management">Gestao de trabalho</SelectItem>
            <SelectItem value="relationship">Relacionamento</SelectItem>
            <SelectItem value="resource">Recursos</SelectItem>
            <SelectItem value="information">Informacao</SelectItem>
            <SelectItem value="control">Controle</SelectItem>
            <SelectItem value="intelligence">Inteligencia</SelectItem>
            <SelectItem value="commercial">Comercial</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Prioridade</label>
        <Select
          value={priorityFilter}
          onValueChange={(v) => setPriorityFilter(v as CapabilityMvpPriority | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas as prioridades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prioridades</SelectItem>
            <SelectItem value="critical">Critica</SelectItem>
            <SelectItem value="high">Alta</SelectItem>
            <SelectItem value="medium">Media</SelectItem>
            <SelectItem value="low">Baixa</SelectItem>
            <SelectItem value="future">Futura</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-40">
        <label className="text-xs font-medium mb-1 block text-muted-foreground">Status</label>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as CapabilityStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="documented">Documentada</SelectItem>
            <SelectItem value="needs_review">Em revisao</SelectItem>
            <SelectItem value="ready_for_design">Pronta para desenho</SelectItem>
            <SelectItem value="blocked">Bloqueada</SelectItem>
            <SelectItem value="future">Futura</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={onClear}
          className="h-10 px-3 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" /> Limpar
        </Button>
      )}
    </div>
  );
}
