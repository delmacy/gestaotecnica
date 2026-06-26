"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createOperationalReport(_formData: FormData) {
  // REQUIREMENT: Strict workspace scoping.
  // Legacy reports table lacks workspace_id. Blocking creation to prevent cross-tenant leaks.
  throw new Error("Report creation is currently disabled due to missing tenant isolation (workspace_id).");

  // Code below is unreachable but kept for future reference when schema is updated
  /*
  revalidatePath("/");
  revalidatePath("/reports");
  redirect("/reports");
  */
}
