"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Terminal, Activity, Clock, Database, User } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimelineEntry {
  id: string;
  type: "event" | "action" | "audit" | "system";
  title: string;
  timestamp: string;
  status?: string;
  payload?: any;
}

export function BuilderTimeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="flex flex-col h-full bg-background border-t">
      <div className="h-8 border-b px-4 flex items-center justify-between bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="size-3 text-muted-foreground" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Platform Timeline / Event Log
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full bg-green-500" />
            Live Monitoring
          </div>
          <div className="flex items-center gap-1">
            <Database className="size-3" />
            {entries.length} events
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {entries.length === 0 ? (
            <div className="h-20 flex flex-col items-center justify-center border border-dashed rounded-md text-muted-foreground gap-2">
              <Clock className="size-4 opacity-50" />
              <span className="text-xs">Waiting for organizational events...</span>
            </div>
          ) : (
            <div className="relative border-l ml-2 pl-6 space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="relative group">
                  <div className="absolute -left-[31px] top-1 bg-background border rounded-full p-1 group-hover:border-primary transition-colors">
                    {entry.type === 'action' ? (
                      <Activity className="size-3 text-blue-500" />
                    ) : entry.type === 'audit' ? (
                      <User className="size-3 text-orange-500" />
                    ) : (
                      <Database className="size-3 text-primary" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{entry.title}</span>
                        <Badge variant="outline" className="text-[10px] uppercase h-4 py-0">
                          {entry.type}
                        </Badge>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {entry.timestamp}
                      </span>
                    </div>

                    {entry.payload && (
                      <div className="p-2 bg-muted/30 rounded border text-[10px] font-mono overflow-hidden">
                        <pre className="opacity-70">{JSON.stringify(entry.payload, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
