import { getDb } from "@/db";
import { assets } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  assetCriticalities,
  assetStatuses,
  assetTypeSuggestions,
} from "./constants";

type CreateAssetInput = {
  code?: string;
  name?: string;
  type?: string;
  status?: string;
  criticality?: string;
  location?: string;
  description?: string;
};

function pickAllowed<T extends string>(
  value: string | undefined,
  allowedValues: readonly { value: T }[],
  fallback: T,
) {
  return allowedValues.some((item) => item.value === value) ? (value as T) : fallback;
}

export const createAssetKernelAction: ActionDefinition<CreateAssetInput, { id: string; code: string; name: string }> = {
  key: "assets.create",
  moduleKey: "assets",
  description: "Cria um ativo operacional.",
  callableBy: ["ui", "integration", "automation", "system"],
  emits: ["asset.created"],
  async handler(input) {
    const code = String(input.code ?? "").trim();
    const name = String(input.name ?? "").trim();

    if (!code || !name) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "code e name sao obrigatorios." },
      };
    }

    const type = pickAllowed(input.type, assetTypeSuggestions, assetTypeSuggestions[0]?.value ?? "equipment");
    const status = pickAllowed(input.status, assetStatuses, "active");
    const criticality = pickAllowed(input.criticality, assetCriticalities, "medium");
    const db = getDb();
    const [asset] = await db
      .insert(assets)
      .values({
        code,
        name,
        type,
        status,
        criticality,
        location: input.location,
        description: input.description,
        metadata: { createdByKernelAction: true },
      })
      .returning({
        id: assets.id,
        code: assets.code,
        name: assets.name,
      });

    return {
      success: true,
      data: asset,
      events: [
        {
          eventType: "asset.created",
          entityType: "asset",
          entityId: asset.id,
          payload: { code, name, type, status, criticality },
        },
      ],
    };
  },
};
