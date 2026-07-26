"use client";

import React, { useEffect, useState } from "react";
import { type TenantCommercialContext } from "@/platform/commercial/contracts/commercial-ia-map";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lock, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export function CommercialMap({ workspaceId }: { workspaceId: string }) {
  const [data, setData] = useState<TenantCommercialContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/workspaces/${workspaceId}/commercial-ia`);
        if (!response.ok) {
          throw new Error("Failed to load commercial capabilities.");
        }
        const json = await response.json();
        setData(json);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [workspaceId]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  const { activeCapabilities, quotas, utilizationMetrics } = data;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Commercial Capabilities</h2>
        <p className="text-muted-foreground">Manage your active modules and access.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCapabilities.map((cap) => (
          <Card key={cap.id} className={cap.status === "blocked" ? "opacity-75" : ""} title={cap.status === "blocked" ? "Pro Feature" : undefined}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base font-semibold">{cap.name}</CardTitle>
                <CardDescription className="text-xs">{cap.category}</CardDescription>
              </div>
              {cap.status === "active" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              {cap.status === "blocked" && <Lock className="h-5 w-5 text-muted-foreground" />}
              {cap.status === "coming_soon" && <Clock className="h-5 w-5 text-amber-500" />}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">{cap.description}</p>
              <div className="mt-4">
                <Badge variant={cap.status === "active" ? "default" : "secondary"}>
                  {cap.status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quotas</CardTitle>
          </CardHeader>
          <CardContent>
             <dl className="space-y-2 text-sm">
              {Object.entries(quotas).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2 last:border-0">
                  <dt className="text-muted-foreground capitalize">{key.replace("_", " ")}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilization</CardTitle>
          </CardHeader>
          <CardContent>
             <dl className="space-y-2 text-sm">
              {Object.entries(utilizationMetrics).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b pb-2 last:border-0">
                  <dt className="text-muted-foreground capitalize">{key.replace("_", " ")}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
