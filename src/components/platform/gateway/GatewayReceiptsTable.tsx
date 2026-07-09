"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { AgentGatewaySubmissionRecord } from "@/features/platform/gateway/agent-gateway.types";
import { GatewayReceiptStatusBadge } from "./GatewayReceiptStatusBadge";
import { GatewayReceiptDetail } from "./GatewayReceiptDetail";
import { Copy, Eye } from "lucide-react";

interface GatewayReceiptsTableProps {
  receipts: AgentGatewaySubmissionRecord[];
}

export function GatewayReceiptsTable({ receipts }: GatewayReceiptsTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<AgentGatewaySubmissionRecord | null>(null);

  const handleCopy = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    } else {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } catch (err) {
        // Fallback failed
      }
    }
  };

  if (receipts.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
        Não há receipts do Agent Gateway ainda.
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Correlation ID</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell>
                  <GatewayReceiptStatusBadge status={receipt.requestStatus} />
                </TableCell>
                <TableCell className="max-w-[200px] truncate font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="truncate">{receipt.correlationId}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy(receipt.correlationId)}
                      title="Copiar Correlation ID"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{receipt.source}</TableCell>
                <TableCell>{receipt.payloadFormat}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(receipt.receivedAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedReceipt(receipt)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <GatewayReceiptDetail
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </>
  );
}
