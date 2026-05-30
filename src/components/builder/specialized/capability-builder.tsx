"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Zap, History, Database, Layout, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function CapabilityBuilder({ activeItem }: { activeItem: any }) {
  const meta = activeItem.metadata || {};

  return (
    <div className="flex-1 overflow-y-auto bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between border-b pb-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
               <Layers className="size-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold tracking-tight">{activeItem.label}</h1>
                <Badge variant="secondary">Core Capability</Badge>
              </div>
              <p className="text-muted-foreground mt-1 max-w-lg">{meta.description || 'Definição de capacidade organizacional replicável.'}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">V1.4.2-STABLE</div>
             <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-bold uppercase shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                Synchronize Registry
             </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Atomic Actions", value: "24", icon: Zap, color: "text-amber-500" },
            { label: "Event Definitions", value: "12", icon: History, color: "text-blue-500" },
            { label: "Data Entities", value: "6", icon: Database, color: "text-emerald-500" },
            { label: "UI Templates", value: "8", icon: Layout, color: "text-purple-500" },
          ].map(stat => (
            <Card key={stat.label} className="border-none shadow-none bg-muted/30">
               <CardContent className="p-4">
                  <stat.icon className={cn("size-4 mb-2", stat.color)} />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">{stat.label}</div>
               </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Database className="size-5 text-primary" /> Operational Entities
          </h2>
          <div className="space-y-3">
             {['Primary Entity', 'Support Record', 'Audit Entry'].map((entity, i) => (
               <div key={entity} className="flex items-center justify-between p-4 border rounded-xl bg-white hover:border-primary transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded bg-muted flex items-center justify-center font-mono text-xs text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {entity.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{entity}</h3>
                      <p className="text-[10px] text-muted-foreground italic">Registered in Registry Schema</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[9px]">READ_WRITE</Badge>
                    <Badge variant="outline" className="text-[9px]">ENCRYPTED</Badge>
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mt-12">
          <section className="space-y-4">
            <h3 className="font-bold flex items-center gap-2"><Zap className="size-4 text-amber-500" /> Exported Actions</h3>
            <div className="bg-muted/20 rounded-2xl p-4 border border-dashed space-y-2">
               {['create', 'update', 'delete', 'archive', 'process'].map(action => (
                 <div key={action} className="flex items-center gap-2 text-xs font-mono p-2 hover:bg-white rounded transition-colors cursor-pointer">
                    <span className="text-primary">{activeItem.metadata?.key || 'cap'}.</span>
                    <span className="font-bold">{action}</span>
                 </div>
               ))}
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="font-bold flex items-center gap-2"><History className="size-4 text-blue-500" /> Emitted Events</h3>
            <div className="bg-muted/20 rounded-2xl p-4 border border-dashed space-y-2">
               {['created', 'updated', 'transitioned', 'failed'].map(event => (
                 <div key={event} className="flex items-center gap-2 text-xs font-mono p-2 hover:bg-white rounded transition-colors cursor-pointer">
                    <span className="text-blue-600">{activeItem.metadata?.key || 'cap'}.</span>
                    <span className="font-bold">{event}</span>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
