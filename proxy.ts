import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";

/**
 * Public routes that do NOT require authentication.
 * Everything else matched by the config.matcher is protected.
 */
const publicRoutes = ["/unauthorized"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip authentication for public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.GENUKA_CLIENT_SECRET!
    );
    const { jwtVerify } = await import("jose");
    await jwtVerify(token, secret);
  } catch (error) {
    console.error("JWT verification failed in middleware:", error);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Files with extensions
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
