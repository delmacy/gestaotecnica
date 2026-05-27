import { getDb } from "@/db";
import { workItems } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import { workItemPriorities, workItemTypes } from "./constants";

type CreateWorkItemInput = {
  title?: string;
  description?: string;
  type?: string;
  priority?: string;
};

function pickAllowed<T extends string>(
  value: string | undefined,
  allowedValues: readonly { value: T }[],
  fallback: T,
) {
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export const createWorkItemKernelAction: ActionDefinition<CreateWorkItemInput, { id: string; title: string }> = {
  key: "work_items.create",
  moduleKey: "work-items",
  description: "Cria uma demanda operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["work_item.created"],
  async handler(input) {
    const title = String(input.title ?? "").trim();
    if (!title) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "title e obrigatorio." },
      };
    }

    const type = pickAllowed(input.type, workItemTypes, "solicitacao");
    const priority = pickAllowed(input.priority, workItemPriorities, "medium");
    const db = getDb();
    const [workItem] = await db
      .insert(workItems)
      .values({
        title,
        description: input.description,
        type,
        priority,
        status: "open",
        payload: {
          createdByKernelAction: true,
        },
      })
      .returning({
        id: workItems.id,
        title: workItems.title,
      });

    return {
      success: true,
      data: workItem,
      events: [
        {
          eventType: "work_item.created",
          entityType: "work_item",
          entityId: workItem.id,
          payload: { title: workItem.title, type, priority },
        },
      ],
    };
  },
};
