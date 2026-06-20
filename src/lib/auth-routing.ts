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
 * Decode a JWT payload WITHOUT verifying the signature. Used only for edge-side
 * routing decisions (middleware) — the real authorization gate is the backend +
 * the (admin) layout. Edge-runtime safe. Returns null on any parse failure.
 */
export function decodeToken(token?: string): Record<string, unknown> | null {
  if (!token) return null
  try {
    const payload = token.split(".")[1]
    if (!payload) return null
    let b64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    while (b64.length % 4) b64 += "="
    const json =
      typeof atob === "function"
        ? atob(b64)
        : Buffer.from(b64, "base64").toString("utf8")
    return JSON.parse(json)
  } catch {
    return null
  }
}

/** True when the token has an `exp` claim that is already in the past. */
export function isTokenExpired(token?: string): boolean {
  const claims = decodeToken(token)
  const exp = claims?.exp
  if (typeof exp !== "number") return false // no exp → can't tell; treat as live
  return exp * 1000 <= Date.now()
}

/**
 * A token is "usable" for routing only if it parses AND has not expired. A stale
 * (expired) cookie from a previous day must NOT keep the user logged in — that
 * caused "click login → land straight in yesterday's account".
 */
export function isTokenLive(token?: string): boolean {
  return !!decodeToken(token) && !isTokenExpired(token)
}

/** Read the `roles` claim. */
export function rolesFromToken(token?: string): string[] {
  const claims = decodeToken(token)
  return Array.isArray(claims?.roles) ? (claims!.roles as string[]) : []
}

/** True when a LIVE JWT carries the platform super-admin role. */
export function isSuperAdminToken(token?: string): boolean {
  return isTokenLive(token) && rolesFromToken(token).includes(SUPER_ADMIN_ROLE)
}
