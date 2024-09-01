import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  isProtectedAdminRoute,
  isProtectedVendorRoute,
  isProtectedRoute,
  toBeRedirectedAdminRoutes,
  toBeRedirectedVendorRoutes,
  toBeRedirectedRoutes,
} from "./utils/route";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Improved matcher for static assets
  if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

    const adminTokenVerified = await verifyToken("adminToken", req);

    const isProtectedAdmin = isProtectedAdminRoute(pathname);


    if (isProtectedAdmin && !adminTokenVerified) {

      const loginUrl = new URL("/admin", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const toBeRedirectedAdmin = toBeRedirectedAdminRoutes(pathname);
    if (toBeRedirectedAdmin && adminTokenVerified) {

      const feedUrl = new URL("/admin/dashboard", req.url);
      return NextResponse.redirect(feedUrl);
    }

    const VendorTokenVerified = await verifyToken("vendorToken", req);

    const isProtectedVendor = isProtectedVendorRoute(pathname);
    if(isProtectedVendor && !VendorTokenVerified){
      const loginUrl = new URL("/vendorSignup", req.url);
      return NextResponse.redirect(loginUrl);
    }

    const toBeRedirectedVendor = toBeRedirectedVendorRoutes(pathname);
    if(toBeRedirectedVendor && VendorTokenVerified){
      const feedUrl = new URL("/vendordashboard", req.url);
      return NextResponse.redirect(feedUrl);
    }



  const tokenVerified = await verifyToken("token", req);

//   Protected Routes logic - redirect to login if it doesn't have token in localstorage
  const isProtected = isProtectedRoute(pathname);
  if (isProtected && !tokenVerified) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ToBeRedirected Routes logic - redirect to feed if it has token in localstorage
  const toBeRedirected = toBeRedirectedRoutes(pathname);
console.log('1');

  if (toBeRedirected && tokenVerified) {
    console.log('2');

    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};

async function verifyToken(
  vendorToken: string,
  req: NextRequest
): Promise<boolean> {
  const token = req.cookies.get(vendorToken);

  if (!token?.value) {
    return false;
  }

  const secret = 'sanoojsanooj';
  console.log('JWT');
  
  if (!secret) {
    console.log("JWT secret not found in env");
    return false;
  }

  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(secret)
    );

    if (payload) {
      console.log(payload);
      
    } else {
    }
    return Boolean(payload);
  } catch (err: any) {
    console.log(`failed to verify ${vendorToken}`, err.message);
    return false;
  }
}
