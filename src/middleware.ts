import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password"]
const ONBOARDING_ROUTE = "/onboarding"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const accessToken = request.cookies.get("access_token")?.value
  const profileComplete = request.cookies.get("profile_complete")?.value

  const isPublic = PUBLIC_ROUTES.includes(pathname)
  const isOnboarding = pathname.startsWith(ONBOARDING_ROUTE)

  // Not logged in → redirect to login (except public routes)
  if (!accessToken && !isPublic && !isOnboarding) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Logged in but no profile → redirect to onboarding
  if (accessToken && !profileComplete && !isPublic && !isOnboarding) {
    return NextResponse.redirect(new URL("/onboarding", request.url))
  }

  // Logged in + complete → redirect away from auth pages
  if (accessToken && profileComplete && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
