import { FormDefinition } from "../../contracts/form-definition";

export interface FormPersistencePort {
  saveDraft(workspaceId: string, form: FormDefinition): Promise<void>;
  loadDraft(workspaceId: string, id: string): Promise<FormDefinition | null>;
  listVersions(workspaceId: string, key: string): Promise<FormDefinition[]>;
  deleteDraft(workspaceId: string, id: string): Promise<void>;
}
