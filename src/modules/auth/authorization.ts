import { redirect } from "next/navigation";
import { getCurrentUser } from "./session";
import { AccessProfile } from "./access-profiles";

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth/login");
  }
  return user;
}

export async function requireAccessProfile(allowedProfiles: AccessProfile[]) {
  const user = await requireCurrentUser();
  if (!allowedProfiles.includes(user.accessProfile as AccessProfile)) {
    const required = allowedProfiles.join(", ");
    redirect("/blocked?role=" + encodeURIComponent(required));
  }
  return user;
}
