import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  isProtectedAdminRoute,
  isProtectedVendorRoute,
  isProtectedUserRoute,
  toBeRedirectedAdminRoutes,
  toBeRedirectedVendorRoutes,
  toBeRedirectedRoutes,
} from "./utils/route";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Determine the route type
  if (isProtectedAdminRoute(pathname)) {
    const adminTokenVerified = await verifyToken("adminToken", req);
    if (!adminTokenVerified) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (toBeRedirectedAdminRoutes(pathname)) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  } else if (isProtectedVendorRoute(pathname)) {
    const vendorTokenVerified = await verifyToken("vendorToken", req);
    if (!vendorTokenVerified) {
      return NextResponse.redirect(new URL("/vendorLogin", req.url));
    }
    if (toBeRedirectedVendorRoutes(pathname)) {
      return NextResponse.redirect(new URL("/vendordashboard", req.url));
    }
  } else if (isProtectedUserRoute(pathname)) {
    const userTokenVerified = await verifyToken("token", req);
    if (!userTokenVerified) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (toBeRedirectedRoutes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)",
};

// Helper function to verify tokens
async function verifyToken(tokenName: string, req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(tokenName);
  if (!token?.value) {
    return false;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not defined in environment variables");
    return false;
  }

  try {
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret));
    return Boolean(payload);
  } catch (err: any) {
    console.error(`Failed to verify token (${tokenName}): ${err.message}`);
    return false;
  }
}
