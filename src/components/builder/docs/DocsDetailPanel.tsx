"use client";

import { DocsItem } from "./docs-types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LinkIcon, FileText, CheckCircle2, GitCommitHorizontal, LayoutDashboard } from "lucide-react";

interface DocsDetailPanelProps {
  item: DocsItem | null;
}

export function DocsDetailPanel({ item }: DocsDetailPanelProps) {
  if (!item) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <FileText className="h-12 w-12 mb-4 opacity-20" />
        <p>Select a document to view its details.</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-6 bg-muted/30">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="text-xl font-bold">{item.title}</h2>
          <Badge variant="outline">{item.phase}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{item.category}</Badge>
          <Badge variant="secondary">{item.module}</Badge>
          <Badge variant={item.status === "done" ? "default" : "secondary"}>
            {item.status}
          </Badge>
          {item.synthetic && (
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
              Synthetic
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Summary
            </h3>
            <p className="text-sm leading-relaxed">{item.summary}</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
              <GitCommitHorizontal className="w-4 h-4" />
              Source Path
            </h3>
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-muted-foreground block w-full overflow-x-auto">
              {item.source_path}
            </code>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {item.related_docs.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Related Docs
                </h3>
                <ul className="space-y-2">
                  {item.related_docs.map((doc) => (
                    <li key={doc.id} className="text-sm text-primary hover:underline cursor-pointer">
                      {doc.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {item.related_tasks.length > 0 && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Related Tasks
                </h3>
                <ul className="space-y-2">
                  {item.related_tasks.map((task) => (
                    <li key={task.id} className="text-sm text-primary hover:underline cursor-pointer">
                      {task.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {item.related_capabilities.length > 0 && (
              <section className="col-span-1 md:col-span-2">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {item.related_capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Last known state: {item.last_known_state}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}