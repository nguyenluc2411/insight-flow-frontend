import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { isSuperAdminToken, isTokenLive } from "@/lib/auth-routing"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"]
const ONBOARDING_ROUTE = "/onboarding"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const rawToken = request.cookies.get("access_token")?.value
  const profileComplete = request.cookies.get("profile_complete")?.value

  // An expired/garbage cookie must NOT count as a session — otherwise yesterday's
  // stale token bounces the user off /login straight back into the old account.
  const accessToken = isTokenLive(rawToken) ? rawToken : undefined

  const isPublic = PUBLIC_ROUTES.includes(pathname) || pathname.startsWith("/news")
  const isOnboarding = pathname.startsWith(ONBOARDING_ROUTE)
  const isAuthPage = pathname === "/login" || pathname === "/register"

  // Not logged in → redirect to login (except public routes)
  if (!accessToken && !isPublic && !isOnboarding) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (accessToken) {
    // Platform super-admin lives in /admin and skips onboarding entirely.
    // Bounce them off auth pages straight to the admin console; otherwise let
    // them through (they may also visit the normal app via "Về ứng dụng").
    if (isSuperAdminToken(accessToken)) {
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/admin", request.url))
      }
      return NextResponse.next()
    }

    // Regular user, no profile yet → onboarding
    if (!profileComplete && !isPublic && !isOnboarding) {
      return NextResponse.redirect(new URL("/onboarding", request.url))
    }

    // Regular user, profile complete → keep them out of the auth pages
    if (profileComplete && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
