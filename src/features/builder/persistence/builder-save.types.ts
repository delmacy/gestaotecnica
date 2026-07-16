import type { SaveBuilderDraftInputContract, SaveBuilderDraftResultContract } from "@/platform/contracts/builder-client";
import type { BuilderDraft } from "../types";

export type SaveBuilderDraftOfficialInput = Omit<SaveBuilderDraftInputContract, 'draft'> & { draft: BuilderDraft };
export type SaveBuilderDraftOfficialResult = SaveBuilderDraftResultContract;
