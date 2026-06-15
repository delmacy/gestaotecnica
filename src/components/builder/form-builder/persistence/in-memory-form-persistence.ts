import { FormDefinition } from "../contracts/form-definition-contract";
import { FormPersistencePort } from "./form-persistence-port";
import { WorkspaceDivergenceError } from "./errors";

export class InMemoryFormPersistence implements FormPersistencePort {
  private drafts: Map<string, FormDefinition> = new Map();

  async saveDraft(workspaceId: string, form: FormDefinition): Promise<void> {
    if (form.workspace_id !== workspaceId) {
      throw new WorkspaceDivergenceError(
        `Form workspace_id (${form.workspace_id}) does not match context workspaceId (${workspaceId})`
      );
    }

    // Defensive copy
    const copy = JSON.parse(JSON.stringify(form));
    this.drafts.set(form.id, copy);
  }

  async loadDraft(workspaceId: string, id: string): Promise<FormDefinition | null> {
    const draft = this.drafts.get(id);
    if (!draft) return null;

    if (draft.workspace_id !== workspaceId) {
      throw new WorkspaceDivergenceError(
        `Form ${id} belongs to a different workspace`
      );
    }

    // Defensive copy
    return JSON.parse(JSON.stringify(draft));
  }

  async listVersions(workspaceId: string, key: string): Promise<FormDefinition[]> {
    return Array.from(this.drafts.values())
      .filter((f) => f.key === key && f.workspace_id === workspaceId)
      .map((f) => JSON.parse(JSON.stringify(f)));
  }

  async deleteDraft(workspaceId: string, id: string): Promise<void> {
    const draft = this.drafts.get(id);
    if (!draft) return;

    if (draft.workspace_id !== workspaceId) {
      throw new WorkspaceDivergenceError(
        `Cannot delete form ${id} belonging to a different workspace`
      );
    }

    this.drafts.delete(id);
  }
}
