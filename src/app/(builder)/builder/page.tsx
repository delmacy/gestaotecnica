import { BuilderPage } from "@/features/builder/process-editor/BuilderPage";
import { requireAccessProfile } from "@/modules/auth/authorization";

export default async function Page() {
  await requireAccessProfile(["builder"]);
  return <BuilderPage />;
}
