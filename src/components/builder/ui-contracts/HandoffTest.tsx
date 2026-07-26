'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Rocket, ExternalLink, ShieldAlert, FlaskConical, TestTube } from 'lucide-react';
import { BuilderHandoffResponse } from '@/platform/builder/contracts/handoff/handoff-contract';
import { toast } from 'sonner';

export function HandoffTest() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<BuilderHandoffResponse | null>(null);

  const testCases = [
    { id: 'live-app', label: 'Production App', env: 'production', icon: <Rocket className="w-4 h-4 mr-2" />, variant: 'default' as const },
    { id: 'empty-app', label: 'Empty App (No Configs)', env: 'production', icon: <AlertCircle className="w-4 h-4 mr-2" />, variant: 'outline' as const },
    { id: 'blocked-app', label: 'Restricted App (No Rights)', env: 'production', icon: <ShieldAlert className="w-4 h-4 mr-2" />, variant: 'secondary' as const },
    { id: 'demo-app', label: 'Demo App', env: 'demo', icon: <FlaskConical className="w-4 h-4 mr-2" />, variant: 'secondary' as const },
    { id: 'synth-app', label: 'Synthetic App', env: 'production', icon: <TestTube className="w-4 h-4 mr-2" />, variant: 'secondary' as const },
  ];

  const handleDeploy = async (appId: string, env: string) => {
    setLoading(appId);
    setResult(null);
    try {
      const response = await fetch('/api/builder/handoff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appId,
          version: '1.0.0',
          environmentId: env,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch handoff endpoint');
      }

      const data = await response.json();
      setResult(data);

      if (data.success) {
        toast.success(`Successfully deployed: ${data.message || 'Ready in runtime'}`);
      } else {
        toast.error(`Deploy failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during handoff request');
    } finally {
      setLoading(null);
    }
  };

  const handleViewInRuntime = () => {
    if (result?.runtimeUrl) {
      router.push(result.runtimeUrl);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testCases.map((tc) => (
          <Card key={tc.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                {tc.icon}
                {tc.label}
              </CardTitle>
              <CardDescription>ID: {tc.id} | Env: {tc.env}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-slate-500 mb-4">
                {tc.id === 'empty-app' && 'Simulates an application with no viable versions deployed. Should block launch.'}
                {tc.id === 'blocked-app' && 'Simulates a user lacking runtime deployment privileges. Should disable action.'}
                {tc.id === 'demo-app' && 'Simulates deployment to a demo environment. Ephemeral sandbox.'}
                {tc.id === 'synth-app' && 'Simulates deployment of a synthetic application. Distinct badging.'}
                {tc.id === 'live-app' && 'Simulates a real configuration handing off to a live production server.'}
              </p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <Button
                variant={tc.variant}
                size="sm"
                onClick={() => handleDeploy(tc.id, tc.env)}
                disabled={loading !== null || tc.id === 'blocked-app' || tc.id === 'empty-app'}
                className={tc.id === 'blocked-app' ? 'opacity-50' : ''}
              >
                {loading === tc.id ? 'Deploying...' :
                 tc.id === 'blocked-app' ? 'Pro Feature (Restricted)' :
                 tc.id === 'demo-app' ? 'Deploy to Demo Runtime' :
                 tc.id === 'empty-app' ? 'No configs to deploy' :
                 'Deploy to Production Network'}
              </Button>
              {tc.id === 'empty-app' && <span className="text-xs text-red-500 font-medium">Empty</span>}
              {tc.id === 'blocked-app' && <span className="text-xs text-amber-500 font-medium">Restricted</span>}
            </CardFooter>
          </Card>
        ))}
      </div>

      {result && (
        <Card className={`border-2 ${result.success ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? <CheckCircle2 className="text-green-500" /> : <AlertCircle className="text-red-500" />}
              Handoff Result: {result.status?.toUpperCase() || (result.success ? 'SUCCESS' : 'FAILED')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium text-lg mb-2">{result.message}</p>

            <div className="bg-slate-100 p-3 rounded text-xs font-mono mb-4">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>

            {result.success && result.runtimeUrl && (
              <div className="mt-4 p-4 bg-white rounded-lg border shadow-sm">
                <h4 className="text-sm font-semibold mb-2">Handoff Complete</h4>
                <p className="text-sm text-slate-600 mb-4">
                  The configuration has been deployed. You can now transition to the runtime environment.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleViewInRuntime} className="gap-2">
                    View in Runtime <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
