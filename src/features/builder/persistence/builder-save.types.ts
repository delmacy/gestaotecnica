import type { BuilderDraft } from "../types";
import type {
  SaveBuilderDraftOfficialInput as PlatformSaveBuilderDraftOfficialInput,
  SaveBuilderDraftOfficialResult
} from "@/platform/builder/contracts/builder-client-interactions";

export type SaveBuilderDraftOfficialInput = Omit<PlatformSaveBuilderDraftOfficialInput, 'draft'> & {
  draft: BuilderDraft;
};

export type { SaveBuilderDraftOfficialResult };
