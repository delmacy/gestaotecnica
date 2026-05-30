import React from "react";
import { TimelineItem } from "../application/timeline.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProcessInstanceTimelineProps {
  items: TimelineItem[];
}

export function ProcessInstanceTimeline({ items }: ProcessInstanceTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="relative border-l-2 border-muted ml-4 pl-8 space-y-8">
        {items.map((item: any) => (
          <div key={item.id} className="relative">
            <div className="absolute -left-[41px] top-1 bg-background p-1 border-2 border-muted rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {item.type.replace(/_/g, " ")}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {item.occurredAt.toLocaleString("pt-BR")}
              </p>
              {item.payload && Object.keys(item.payload).length > 0 && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-[10px] font-mono overflow-auto max-h-32">
                  <pre>{JSON.stringify(item.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground pl-2">
            Nenhum evento registrado.
          </p>
        )}
      </div>
    </div>
  );
}
