
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

  const adminTokenVerified = await verifyToken("adminToken", req);
  const vendorTokenVerified = await verifyToken("RefreshToken", req);
  const userTokenVerified = await verifyToken("refreshToken", req);
console.log(userTokenVerified,'pop');

  // Admin Routes
  const isProtectedAdmin = isProtectedAdminRoute(pathname);
  if (isProtectedAdmin && !adminTokenVerified) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }
  const toBeRedirectedAdmin = toBeRedirectedAdminRoutes(pathname);
  if (toBeRedirectedAdmin && adminTokenVerified) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // Vendor Routes
  const isProtectedVendor = isProtectedVendorRoute(pathname);
  if (isProtectedVendor && !vendorTokenVerified) {
    return NextResponse.redirect(new URL("/vendorLogin", req.url));
  }
  const toBeRedirectedVendor = toBeRedirectedVendorRoutes(pathname);
  if (toBeRedirectedVendor && vendorTokenVerified) {
    return NextResponse.redirect(new URL("/vendordashboard", req.url));
  }

  // User Routes
  const isProtectedUser = isProtectedUserRoute(pathname);
  if (isProtectedUser && !userTokenVerified) {    
    return NextResponse.redirect(new URL("/login", req.url)); 
  }
  const toBeRedirectedUser = toBeRedirectedRoutes(pathname);
  if (toBeRedirectedUser && userTokenVerified) {
    return NextResponse.redirect(new URL("/", req.url));  
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

async function verifyToken(tokenName: string, req: NextRequest): Promise<boolean> {
  console.log(tokenName,'name');
  
  const token = req.cookies.get(tokenName);
  console.log(token,'ellam token',token?.value);
  
  if (!token?.value) {
    console.log('ellam poi');
    
    return false;
  }

  const secret = process.env.JWT_SECRET || "sanoojsanooj";

  try {
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret)); 
    return Boolean(payload);
  } catch (err: any) {
    console.log(`Failed to verify ${tokenName}:`, err.message);
    return false;
  }
}
