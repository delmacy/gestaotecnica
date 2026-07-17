import { getRuntimeDb } from "@/db";
import { forms } from "@/db/runtime/schema/workflow";
import { eq, and } from "drizzle-orm";
import { FormDefinition } from "../contracts/form-definition";

export class FormRepository {
  async getFormById(workspaceId: string, formId: string) {
    const db = getRuntimeDb();
    const result = await db
      .select()
      .from(forms)
      .where(and(eq(forms.workspaceId, workspaceId), eq(forms.id, formId)))
      .limit(1);

    return result[0] || null;
  }

  async saveForm(workspaceId: string, form: FormDefinition) {
    const db = getRuntimeDb();

    // Check if it exists to know if we need to insert or update.
    const existing = await this.getFormById(workspaceId, form.id);
    if (existing) {
        await db.update(forms)
          .set({
              key: form.key,
              name: form.name,
              description: form.description,
              updatedAt: new Date(form.updated_at)
          })
          .where(and(eq(forms.workspaceId, workspaceId), eq(forms.id, form.id)));
    } else {
        await db.insert(forms).values({
            id: form.id,
            workspaceId: workspaceId,
            key: form.key,
            name: form.name,
            description: form.description,
            createdAt: new Date(form.created_at),
            updatedAt: new Date(form.updated_at)
        });
    }
  }

  async listForms(workspaceId: string) {
      const db = getRuntimeDb();
      const result = await db.select().from(forms).where(eq(forms.workspaceId, workspaceId));
      return result;
  }
}
