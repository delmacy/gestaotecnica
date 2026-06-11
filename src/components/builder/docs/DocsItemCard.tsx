"use client";

import { DocsItem } from "./docs-types";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocsItemCardProps {
  item: DocsItem;
  isSelected: boolean;
  onClick: (item: DocsItem) => void;
}

export function DocsItemCard({ item, isSelected, onClick }: DocsItemCardProps) {
  return (
    <div
      onClick={() => onClick(item)}
      className={cn(
        "group relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left text-sm transition-all hover:bg-accent cursor-pointer",
        isSelected ? "bg-accent border-primary" : "bg-card"
      )}
    >
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{item.title}</span>
        </div>
        <Badge variant={item.status === "done" ? "default" : "secondary"} className="text-[10px]">
          {item.status}
        </Badge>
      </div>

      <div className="line-clamp-2 text-xs text-muted-foreground">
        {item.summary}
      </div>

      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <Badge variant="outline" className="text-[10px]">
          {item.category}
        </Badge>
        {item.synthetic && (
          <Badge variant="outline" className="text-[10px] bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            mock
          </Badge>
        )}
      </div>
    </div>
  );
}