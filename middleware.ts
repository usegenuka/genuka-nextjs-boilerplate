import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
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
