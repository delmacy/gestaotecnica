import { FormDefinition } from "../contracts/form-definition-contract";
import { FormPersistencePort } from "./form-persistence-port";

export class InMemoryFormPersistence implements FormPersistencePort {
  private drafts: Map<string, FormDefinition> = new Map();

  async saveDraft(form: FormDefinition): Promise<void> {
    // Defensive copy
    const copy = JSON.parse(JSON.stringify(form));
    this.drafts.set(form.id, copy);
  }

  async loadDraft(id: string): Promise<FormDefinition | null> {
    const draft = this.drafts.get(id);
    if (!draft) return null;
    // Defensive copy
    return JSON.parse(JSON.stringify(draft));
  }

  async listVersions(key: string): Promise<FormDefinition[]> {
    return Array.from(this.drafts.values())
      .filter((f) => f.key === key)
      .map((f) => JSON.parse(JSON.stringify(f)));
  }

  async deleteDraft(id: string): Promise<void> {
    this.drafts.delete(id);
  }
}
