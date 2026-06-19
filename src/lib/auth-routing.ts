import type { User } from "@/types/auth.types"

/** Platform super-admin role name (matches auth-service / JWT `roles` claim). */
export const SUPER_ADMIN_ROLE = "SUPER_ADMIN"

/**
 * Where a freshly-authenticated user should land.
 * - SUPER_ADMIN → the platform admin console (/admin)
 * - profile not yet completed → onboarding
 * - otherwise → the normal app dashboard
 */
export function landingPathForUser(user: Pick<User, "roles" | "profileComplete"> | null): string {
  if (user?.roles?.includes(SUPER_ADMIN_ROLE)) return "/admin"
  if (!user?.profileComplete) return "/onboarding"
  return "/dashboard"
}

/**
 * Read the `roles` claim straight from a JWT payload WITHOUT verifying the
 * signature. Used only for edge-side routing decisions (middleware) — the real
 * authorization gate is the backend + the (admin) layout. Edge-runtime safe.
 */
export function rolesFromToken(token?: string): string[] {
  if (!token) return []
  try {
    const payload = token.split(".")[1]
    if (!payload) return []
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "="
    const json =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8")
    const claims = JSON.parse(json)
    return Array.isArray(claims.roles) ? claims.roles : []
  } catch {
    return []
  }
}

/** True when the JWT carries the platform super-admin role. */
export function isSuperAdminToken(token?: string): boolean {
  return rolesFromToken(token).includes(SUPER_ADMIN_ROLE)
}
