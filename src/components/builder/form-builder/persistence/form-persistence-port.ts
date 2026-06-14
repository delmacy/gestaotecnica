import { FormDefinition } from "../contracts/form-definition-contract";

export interface FormPersistencePort {
  saveDraft(form: FormDefinition): Promise<void>;
  loadDraft(id: string): Promise<FormDefinition | null>;
  listVersions(key: string): Promise<FormDefinition[]>;
  deleteDraft(id: string): Promise<void>;
}
