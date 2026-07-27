"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EvidenceHandoffClient() {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleHandoff = async (scenario: string) => {
    setIsLoading(true);
    setStatus(null);
    setMessage(null);
    setReceiptUrl(null);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (scenario === "blocked") {
        headers["x-user-role"] = "blocked";
      } else if (scenario === "demo") {
        headers["x-environment-id"] = "demo";
      } else if (scenario === "synthetic") {
        headers["x-environment-id"] = "synthetic";
      }

      const payload = scenario === "empty"
        ? {}
        : {
            processId: "proc-123",
            executionPayload: { test: true },
            timestamp: new Date().toISOString(),
          };

      const res = await fetch("/api/runtime/evidence/handoff", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setStatus(data.status || "error");
      setMessage(data.message || (data.success ? "Success" : "Failed"));
      if (data.receiptUrl) {
        setReceiptUrl(data.receiptUrl);
      }

      if (data.success && data.receiptUrl) {
        // Optional auto-navigate, but for testing we show the receipt button
        console.log("Would navigate to:", data.receiptUrl);
      }
    } catch (e) {
      setStatus("error");
      setMessage("Request failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex flex-wrap gap-4">
        <Button
          onClick={() => handleHandoff("success")}
          disabled={isLoading}
          data-testid="btn-success"
        >
          Submit to Record (Real)
        </Button>
        <Button
          onClick={() => handleHandoff("empty")}
          disabled={isLoading}
          variant="secondary"
          data-testid="btn-empty"
        >
          Submit (Empty)
        </Button>
        <Button
          onClick={() => handleHandoff("blocked")}
          disabled={isLoading}
          variant="destructive"
          data-testid="btn-blocked"
        >
          Submit (Blocked)
        </Button>
        <Button
          onClick={() => handleHandoff("demo")}
          disabled={isLoading}
          variant="outline"
          data-testid="btn-demo"
        >
          Submit (Demo)
        </Button>
        <Button
          onClick={() => handleHandoff("synthetic")}
          disabled={isLoading}
          variant="outline"
          data-testid="btn-synthetic"
        >
          Submit (Synthetic)
        </Button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-md border ${
            status === 'success' ? 'bg-green-50 border-green-200' :
            status === 'demo' ? 'bg-blue-50 border-blue-200' :
            status === 'synthetic' ? 'bg-purple-50 border-purple-200' :
            status === 'blocked' ? 'bg-red-50 border-red-200' :
            status === 'empty' ? 'bg-yellow-50 border-yellow-200' :
            'bg-gray-50 border-gray-200'
          }`}
          data-testid={`result-${status}`}
        >
          <h3 className="font-semibold mb-2 capitalize" data-testid="status-text">
            {status === 'success' ? 'Official Record Captured' :
             status === 'demo' ? 'Logged to Demo Vault' :
             status === 'synthetic' ? 'Synthetic Record' :
             status === 'blocked' ? 'Submission Restricted' :
             status === 'empty' ? 'Required information missing' :
             'Status'}
          </h3>
          <p className="text-sm text-gray-700 mb-4">{message}</p>

          {receiptUrl && (
            <div className="flex gap-4">
              <Button
                onClick={() => router.push(receiptUrl)}
                data-testid="btn-view-receipt"
              >
                View Evidence Receipt
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/runtime/dashboard')}
                data-testid="btn-next-task"
              >
                Next Task
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
