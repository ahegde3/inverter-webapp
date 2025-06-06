import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Configuration
const PUBLIC_PATHS = ["/", "/login", "/forgot-password", "/reset-password"];
const JWT_SECRET = new TextEncoder().encode(
  process.env.SECRET_KEY || "your-secret"
);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname === path)) {
    return NextResponse.next();
  }

  // Get session token from cookies
  const token = request.cookies.get("session-token")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    // Verify and decode the token
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check if token is expired (exp is in seconds)
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return redirectToLogin(request);
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid
    return redirectToLogin(request);
  }
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/", request.url);
  return NextResponse.redirect(loginUrl);
}

// Configure middleware to run on all routes except public assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
