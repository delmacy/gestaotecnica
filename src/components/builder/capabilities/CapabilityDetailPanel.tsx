import React from "react";
import { CapabilityItem } from "./capability-types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ShieldAlert,
  DownloadCloud,
  ExternalLink,
  Layers,
  Network,
  Activity,
  Database,
  CheckCircle2
} from "lucide-react";

interface CapabilityDetailPanelProps {
  capability: CapabilityItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestInstall: (capabilityId: string) => void;
}

export function CapabilityDetailPanel({
  capability,
  isOpen,
  onClose,
  onRequestInstall
}: CapabilityDetailPanelProps) {

  if (!capability) return null;

  const isInstallable = ['available', 'simulated_requested'].includes(capability.install_state);
  const isAlreadyRequested = capability.install_state === 'simulated_requested';

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="capitalize">{capability.category}</Badge>
            {capability.core_business && (
              <Badge variant="default" className="bg-indigo-600">Core Business</Badge>
            )}
          </div>
          <SheetTitle className="text-2xl flex items-center gap-2">
            {capability.name}
          </SheetTitle>
          <SheetDescription>
            {capability.slug} • Priority: <span className="capitalize font-semibold">{capability.mvp_priority}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
            <p className="text-sm">{capability.description}</p>
          </div>

          {/* Install Action */}
          <div className="bg-muted/50 p-4 rounded-lg border border-border">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm">Installation Status</h4>
                  <p className="text-xs text-muted-foreground capitalize">
                    Current state: {capability.install_state.replace('_', ' ')}
                  </p>
                </div>
                <Button
                  disabled={!isInstallable || isAlreadyRequested}
                  onClick={() => onRequestInstall(capability.id)}
                  size="sm"
                  className={isAlreadyRequested ? "bg-green-600 text-white hover:bg-green-700" : ""}
                >
                  {isAlreadyRequested ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Requested
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="mr-2 h-4 w-4" />
                      Request Install
                    </>
                  )}
                </Button>
              </div>
              <div className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
                <strong>Notice:</strong> Install request is simulated locally. No workspace or database will be changed. ({capability.synthetic_notes})
              </div>
            </div>
          </div>

          <Separator />

          {/* Dependencies */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Layers className="h-4 w-4" /> Depends On ({capability.depends_on.length})
              </h3>
              {capability.depends_on.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {capability.depends_on.map(dep => (
                    <li key={dep} className="text-blue-600 hover:underline cursor-pointer">{dep}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Network className="h-4 w-4" /> Used By ({capability.used_by.length})
              </h3>
              {capability.used_by.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {capability.used_by.map(dep => (
                    <li key={dep} className="text-blue-600 hover:underline cursor-pointer">{dep}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Entities */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Database className="h-4 w-4" /> Owns Entities
              </h3>
              {capability.owns_entities.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {capability.owns_entities.map(ent => (
                    <Badge key={ent} variant="secondary" className="text-xs font-normal">{ent}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Does Not Own</h3>
              {capability.does_not_own.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {capability.does_not_own.map(ent => (
                    <Badge key={ent} variant="outline" className="text-xs font-normal text-muted-foreground">{ent}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Processes & Events */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Activity className="h-4 w-4" /> Main Processes
              </h3>
              {capability.main_processes.length > 0 ? (
                <ul className="text-sm list-disc list-inside space-y-1 text-slate-700">
                  {capability.main_processes.map(proc => (
                    <li key={proc}>{proc}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Main Events</h3>
              {capability.main_events.length > 0 ? (
                <ul className="text-sm list-disc list-inside space-y-1 text-slate-700">
                  {capability.main_events.map(evt => (
                    <li key={evt} className="font-mono text-xs">{evt}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground italic">None</p>
              )}
            </div>
          </div>

          {/* Boundary Risks */}
          {capability.boundary_risk.length > 0 && (
            <>
              <Separator />
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h3 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-1">
                  <div title="Boundary Risks"><ShieldAlert className="h-4 w-4" /></div> Boundary Risks
                </h3>
                <ul className="space-y-2">
                  {capability.boundary_risk.map((risk, idx) => (
                    <li key={idx} className="text-xs text-red-700">
                      <strong>[{risk.type.toUpperCase()}]</strong> {risk.description}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* Related Docs */}
          {capability.related_docs.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Documentation</h3>
                <ul className="space-y-2">
                  {capability.related_docs.map((doc, idx) => (
                    <li key={idx}>
                      <a href={doc.url} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> {doc.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          <div className="pb-8"></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
