import { getDb } from "@/db";
import { assets } from "@/db/schema";
import type { ActionDefinition } from "@/platform/actions";
import {
  actionObjectSchema,
  enumProperty,
  stringProperty,
  uuidProperty,
} from "@/platform/actions/schema-presets";
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
  inputSchema: actionObjectSchema(
    {
      code: stringProperty("Código único do ativo."),
      name: stringProperty("Nome do ativo."),
      type: enumProperty(assetTypeSuggestions.map((type) => type.value), "Tipo do ativo."),
      status: enumProperty(assetStatuses.map((status) => status.value), "Status inicial."),
      criticality: enumProperty(assetCriticalities.map((criticality) => criticality.value), "Criticidade."),
      location: stringProperty("Localização ou referência operacional."),
      description: stringProperty("Descrição livre do ativo."),
    },
    ["code", "name"],
  ),
  outputSchema: actionObjectSchema({
    id: uuidProperty("Identificador do ativo."),
    code: stringProperty("Código do ativo."),
    name: stringProperty("Nome do ativo."),
  }),
  emits: ["asset.created"],
  async handler(input) {
    const code = String(input.code ?? "").trim();
    const name = String(input.name ?? "").trim();

    if (!code || !name) {
      return {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "code e name sao obrigatórios." },
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

