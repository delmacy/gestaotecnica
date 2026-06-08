"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function GatewayReceiptFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStatus = searchParams.get("status") || "all";
  const currentSource = searchParams.get("source") || "all";
  const currentFormat = searchParams.get("format") || "all";
  const currentSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(currentSearch);

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
    router.push("?");
  };

  const hasActiveFilters = currentStatus !== "all" || currentSource !== "all" || currentFormat !== "all" || currentSearch !== "";

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar ID, Correlation ou Idempotency..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="secondary">Buscar</Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={currentStatus} onValueChange={(v) => updateFilters("status", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="duplicate">Duplicate</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentSource} onValueChange={(v) => updateFilters("source", v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Origem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Origens</SelectItem>
            <SelectItem value="paperclip">Paperclip</SelectItem>
            <SelectItem value="n8n">n8n</SelectItem>
            <SelectItem value="manual_api">Manual API</SelectItem>
            <SelectItem value="unknown">Unknown</SelectItem>
            <SelectItem value="legacy">Legacy</SelectItem>
          </SelectContent>
        </Select>

        <Select value={currentFormat} onValueChange={(v) => updateFilters("format", v)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos Formatos</SelectItem>
            <SelectItem value="canonical">Canonical</SelectItem>
            <SelectItem value="legacy">Legacy</SelectItem>
            <SelectItem value="invalid">Invalid</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={handleClear} title="Limpar Filtros">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
