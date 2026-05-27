import { getDb } from "@/db";
import { shiftLogEntries } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";

type AddShiftLogEntryInput = {
  shiftId?: string;
  title?: string;
  description?: string;
  isPending?: boolean;
  workItemId?: string;
  serviceOrderId?: string;
  assetId?: string;
};

export const addShiftLogEntryKernelAction: ActionDefinition<
  AddShiftLogEntryInput,
  { id: string; title: string; isPending: boolean }
> = {
  key: "shift_logs.add_entry",
  moduleKey: "shifts",
  description: "Adiciona uma entrada ao livro de turno.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["shift_log.entry_added"],
  async handler(input) {
    const shiftId = String(input.shiftId ?? "").trim();
    const title = String(input.title ?? "").trim();
    if (!shiftId || !title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "shiftId e title sao obrigatorios." },
      };
    }

    const db = getDb();
    const [entry] = await db
      .insert(shiftLogEntries)
      .values({
        shiftId,
        title,
        description: input.description,
        isPending: input.isPending ?? false,
        workItemId: input.workItemId,
        serviceOrderId: input.serviceOrderId,
        assetId: input.assetId,
      })
      .returning({
        id: shiftLogEntries.id,
        title: shiftLogEntries.title,
        isPending: shiftLogEntries.isPending,
      });

    return {
      success: true,
      data: entry,
      events: [
        {
          eventType: "shift_log.entry_added",
          entityType: "shift_log_entry",
          entityId: entry.id,
          payload: {
            shiftId,
            title,
            isPending: entry.isPending,
            workItemId: input.workItemId,
            serviceOrderId: input.serviceOrderId,
            assetId: input.assetId,
          },
        },
      ],
    };
  },
};
