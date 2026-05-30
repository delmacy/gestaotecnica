"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  createLabInstance,
  executeLabAction,
  sendLabNotification,
  attachLabEvidence
} from "./actions";
import { DynamicFormRenderer } from "@/platform/forms/components/DynamicFormRenderer";
import { FieldDefinition } from "@/platform/forms/application/build-zod-schema";

// Simple Dialog component as ShadCN might not be fully available in this path
function SimpleDialog({ title, trigger, children }: { title: string, trigger: React.ReactNode, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export function LabClient({ type, workspaceId, versionId, instanceId, fields }: { type: string, workspaceId: string, versionId?: string, instanceId?: string, fields?: FieldDefinition[] }) {
  const [loading, setLoading] = useState(false);

  if (type === "create" && versionId) {
    return (
      <Button
        onClick={async () => {
          setLoading(true);
          await createLabInstance(workspaceId, versionId);
          setLoading(false);
        }}
        disabled={loading}
      >
        {loading ? "Criando..." : "Criar Instância de Teste"}
      </Button>
    );
  }

  if (type === "notify" && instanceId) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          setLoading(true);
          await sendLabNotification(workspaceId, instanceId);
          setLoading(false);
        }}
        disabled={loading}
      >
        Notificar
      </Button>
    );
  }

  if (type === "attach" && instanceId) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          setLoading(true);
          await attachLabEvidence(workspaceId, instanceId, "evidencia_tecnica.txt");
          setLoading(false);
        }}
        disabled={loading}
      >
        Anexar
      </Button>
    );
  }

  if (type === "execute" && instanceId && fields) {
    return (
      <SimpleDialog
        title="Executar Ação: submit_request"
        trigger={<Button size="sm" variant="outline">Enviar</Button>}
      >
        <DynamicFormRenderer
          fields={fields}
          onSubmit={async (data: any) => {
            setLoading(true);
            await executeLabAction(workspaceId, instanceId, "submit_request", data);
            setLoading(false);
            window.location.reload(); // Refresh to see changes
          }}
          isLoading={loading}
          submitLabel="Confirmar Envio"
        />
      </SimpleDialog>
    );
  }

  return null;
}
