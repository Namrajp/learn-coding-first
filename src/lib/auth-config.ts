import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { authorized_user } from "../db/auth.schema";

export type UserRole = "admin" | "editor";

export interface AuthorizedUser {
  email: string;
  role: UserRole;
}

export function isAuthorizedEmailSync(email: string): AuthorizedUser | null {
  const AUTHORIZED_USERS: AuthorizedUser[] = [
    { email: "namrajpudasaini@gmail.com", role: "admin" },
    { email: "active99raj@gmail.com", role: "admin" },
  ];
  const normalized = email.toLowerCase().trim();
  return AUTHORIZED_USERS.find((u) => u.email === normalized) || null;
}

export async function isAuthorizedEmail(
  email: string,
  env: CloudflareBindings,
): Promise<AuthorizedUser | null> {
  const db = drizzle(env.DB);
  const normalized = email.toLowerCase().trim();

  const record = await db
    .select()
    .from(authorized_user)
    .where(eq(authorized_user.email, normalized))
    .limit(1);

  if (record.length > 0) {
    return { email: record[0].email, role: record[0].role as UserRole };
  }

  return isAuthorizedEmailSync(normalized);
}

export async function getAuthorizedUsers(
  env: CloudflareBindings,
): Promise<AuthorizedUser[]> {
  const db = drizzle(env.DB);
  const records = await db.select().from(authorized_user);
  return records.map((r) => ({ email: r.email, role: r.role as UserRole }));
}

export async function addAuthorizedUser(
  env: CloudflareBindings,
  email: string,
  role: UserRole,
  addedBy: string,
): Promise<void> {
  const db = drizzle(env.DB);
  const normalized = email.toLowerCase().trim();

  const existing = await db
    .select()
    .from(authorized_user)
    .where(eq(authorized_user.email, normalized))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(authorized_user)
      .set({ role })
      .where(eq(authorized_user.email, normalized));
  } else {
    await db.insert(authorized_user).values({
      id: crypto.randomUUID(),
      email: normalized,
      role,
      addedBy,
      createdAt: new Date(),
    });
  }
}

export async function removeAuthorizedUser(
  env: CloudflareBindings,
  email: string,
): Promise<void> {
  const db = drizzle(env.DB);
  const normalized = email.toLowerCase().trim();
  await db.delete(authorized_user).where(eq(authorized_user.email, normalized));
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

export function canEdit(role: UserRole): boolean {
  return role === "admin" || role === "editor";
}
