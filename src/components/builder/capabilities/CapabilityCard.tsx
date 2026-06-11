import React from "react";
import { CapabilityItem } from "./capability-types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Server, ArrowRightLeft, ShieldAlert } from "lucide-react";

interface CapabilityCardProps {
  capability: CapabilityItem;
  onClick: (capability: CapabilityItem) => void;
}

export function CapabilityCard({ capability, onClick }: CapabilityCardProps) {
  // Badges based on properties
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500 hover:bg-red-600";
      case "high": return "bg-orange-500 hover:bg-orange-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600 text-yellow-950";
      case "low": return "bg-green-500 hover:bg-green-600";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "documented": return "default";
      case "needs_review": return "secondary";
      case "ready_for_design": return "outline";
      case "blocked": return "destructive";
      default: return "secondary";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "foundation": return "bg-slate-100 text-slate-800 border-slate-300";
      case "work-management": return "bg-blue-100 text-blue-800 border-blue-300";
      case "resource": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "control": return "bg-purple-100 text-purple-800 border-purple-300";
      case "relationship": return "bg-pink-100 text-pink-800 border-pink-300";
      case "information": return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "commercial": return "bg-amber-100 text-amber-800 border-amber-300";
      case "legal": return "bg-rose-100 text-rose-800 border-rose-300";
      case "intelligence": return "bg-indigo-100 text-indigo-800 border-indigo-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={() => onClick(capability)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={`text-xs capitalize ${getCategoryColor(capability.category)}`}>
            {capability.category}
          </Badge>
          <Badge className={`text-xs capitalize ${getPriorityBadgeColor(capability.mvp_priority)}`}>
            {capability.mvp_priority}
          </Badge>
        </div>
        <CardTitle className="text-xl flex items-center gap-2">
          {capability.name}
          {capability.boundary_risk.length > 0 && (
            <div title="Has Boundary Risks">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </div>
          )}
        </CardTitle>
        <CardDescription className="text-sm">
          {capability.slug}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {capability.description}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t flex flex-col gap-2">
        <div className="flex w-full justify-between items-center">
            <div className="flex gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1" title="Depends On">
                <ArrowRightLeft className="h-3 w-3" />
                <span>{capability.depends_on.length}</span>
            </div>
            <div className="flex items-center gap-1" title="Used By">
                <Network className="h-3 w-3" />
                <span>{capability.used_by.length}</span>
            </div>
            <div className="flex items-center gap-1" title="Entities Owned">
                <Server className="h-3 w-3" />
                <span>{capability.owns_entities.length}</span>
            </div>
            </div>
            <Badge variant={getStatusBadgeVariant(capability.status)} className="text-[10px] uppercase">
                {capability.status.replace('_', ' ')}
            </Badge>
        </div>

        <div className="w-full mt-2">
          {capability.install_state === 'simulated_requested' && (
            <div className="text-xs text-center p-1 bg-blue-50 text-blue-700 rounded border border-blue-200">
               Install Requested (Simulated)
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
