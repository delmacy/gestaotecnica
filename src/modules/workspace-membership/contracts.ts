import { z } from "zod";

export const membershipStatusSchema = z.enum(["active", "inactive", "pending"]);
export type MembershipStatus = z.infer<typeof membershipStatusSchema>;

export const workspaceMemberSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email(),
  status: membershipStatusSchema,
  joinedAt: z.date(),
  roles: z.array(z.string()).default([]),
});

export type WorkspaceMember = z.infer<typeof workspaceMemberSchema>;
