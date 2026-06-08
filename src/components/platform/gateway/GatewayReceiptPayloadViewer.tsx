"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface GatewayReceiptPayloadViewerProps {
  payload: Record<string, unknown>;
}

export function GatewayReceiptPayloadViewer({ payload }: GatewayReceiptPayloadViewerProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(payload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-2">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
        onClick={handleCopy}
        title="Copiar JSON"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <pre className="overflow-auto rounded-md bg-muted p-4 text-xs">
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}
