import { getDb } from "@/db";
import { inventoryMovements, inventoryItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  integerProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";

type AdjustStockInput = {
  itemId?: string;
  movementType?: "inbound" | "outbound" | "adjustment";
  quantity?: number;
  notes?: string;
  serviceOrderId?: string;
};

export const adjustStockKernelAction: ActionDefinition<
  AdjustStockInput,
  { id: string; newQuantity: number }
> = {
  key: "inventory.adjust_stock",
  moduleKey: "inventory",
  description: "Registra movimentação de estoque e atualiza saldo.",
  callableBy: ["ui", "integration", "automation", "system"],
  inputSchema: actionObjectSchema(
    {
      itemId: uuidProperty("Item de inventário."),
      movementType: stringProperty("Tipo: inbound, outbound ou adjustment."),
      quantity: integerProperty("Quantidade da movimentação."),
      notes: stringProperty("Observações."),
      serviceOrderId: uuidProperty("Execucao relacionada (se houver)."),
    },
    ["itemId", "movementType", "quantity"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("ID da movimentação."),
    newQuantity: integerProperty("Novo saldo do item."),
  }),
  emits: ["inventory.stock_adjusted"],
  async handler(input, context) {
    const itemId = String(input.itemId ?? "").trim();
    if (!itemId) return { success: false, error: { code: "VALIDATION_ERROR", message: "itemId é obrigatório." } };

    const db = getDb();
    const qty = input.quantity ?? 0;
    const factor = input.movementType === "inbound" ? 1 : -1;
    const delta = qty * factor;

    const [movement] = await db
      .insert(inventoryMovements)
      .values({
        itemId,
        movementType: (input.movementType as "adjustment") ?? "adjustment",
        quantity: qty,
        serviceOrderId: input.serviceOrderId,
        notes: input.notes,
        performedById: context.actor.type === "user" ? context.actor.id : undefined,
      })
      .returning({ id: inventoryMovements.id });

    const [updatedItem] = await db
      .update(inventoryItems)
      .set({
        quantityOnHand: sql`${inventoryItems.quantityOnHand} + ${delta}`,
        updatedAt: new Date(),
      })
      .where(eq(inventoryItems.id, itemId))
      .returning({ quantityOnHand: inventoryItems.quantityOnHand });

    return {
      success: true,
      data: { id: movement.id, newQuantity: updatedItem.quantityOnHand },
      events: [
        {
          eventType: "inventory.stock_adjusted",
          entityType: "inventory_item",
          entityId: itemId,
          payload: { movementId: movement.id, delta, newQuantity: updatedItem.quantityOnHand },
        },
      ],
    };
  },
};
