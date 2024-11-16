// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";
// import {
//   isProtectedAdminRoute,
//   isProtectedVendorRoute,
//   isProtectedUserRoute,
//   toBeRedirectedAdminRoutes,
//   toBeRedirectedVendorRoutes,
//   toBeRedirectedRoutes,
// } from "./utils/route";

// export async function middleware(req: NextRequest) {
//   const pathname = req.nextUrl.pathname;

//   if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon.ico")) {
//     return NextResponse.next();
//   }

//   const adminTokenVerified = await verifyToken("adminToken", req);
//   const vendorTokenVerified = await verifyToken("vendorToken", req);
//   const userTokenVerified = await verifyToken("token", req);

//   // Admin Routes
//   const isProtectedAdmin = isProtectedAdminRoute(pathname);
//   if (isProtectedAdmin && !adminTokenVerified) {
//     return NextResponse.redirect(new URL("/admin", req.url));
//   }
//   const toBeRedirectedAdmin = toBeRedirectedAdminRoutes(pathname);
//   if (toBeRedirectedAdmin && adminTokenVerified) {
//     return NextResponse.redirect(new URL("/admin/dashboard", req.url));
//   }

//   // Vendor Routes
//   const isProtectedVendor = isProtectedVendorRoute(pathname);
//   if (isProtectedVendor && !vendorTokenVerified) {
//     return NextResponse.redirect(new URL("/vendorLogin", req.url));
//   }
//   const toBeRedirectedVendor = toBeRedirectedVendorRoutes(pathname);
//   if (toBeRedirectedVendor && vendorTokenVerified) {
//     return NextResponse.redirect(new URL("/vendordashboard", req.url));
//   }

//   // User Routes
//   const isProtectedUser = isProtectedUserRoute(pathname);
//   if (isProtectedUser && !userTokenVerified ) {
//     return NextResponse.redirect(new URL("/login", req.url));  
//   }
//   const toBeRedirectedUser = toBeRedirectedRoutes(pathname);
//   if (toBeRedirectedUser && userTokenVerified) {
//     return NextResponse.redirect(new URL("/", req.url));  // Redirect to home if already logged in
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
// };

// async function verifyToken(tokenName: string, req: NextRequest): Promise<boolean> {
//   const token = req.cookies.get(tokenName);
//   if (!token?.value) {
//     return false;
//   }

//   const secret = process.env.JWT_SECRET || "sanoojsanooj";

//   try {
//     const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret));
//     return Boolean(payload);
//   } catch (err: any) {
//     console.log(`Failed to verify ${tokenName}:`, err.message);
//     return false;
//   }
// }


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
  const vendorTokenVerified = await verifyToken("vendorToken", req);
  const userTokenVerified = await verifyToken("token", req);

  // Admin Routes
  if (isProtectedAdminRoute(pathname)) {
    if (!adminTokenVerified) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (toBeRedirectedAdminRoutes(pathname) && adminTokenVerified) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // Vendor Routes
  if (isProtectedVendorRoute(pathname)) {
    if (!vendorTokenVerified) {
      return NextResponse.redirect(new URL("/vendorLogin", req.url));
    }
    if (toBeRedirectedVendorRoutes(pathname) && vendorTokenVerified) {
      return NextResponse.redirect(new URL("/vendordashboard", req.url));
    }
  }

  // User Routes
  if (isProtectedUserRoute(pathname)) {
    if (!userTokenVerified) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  if (toBeRedirectedRoutes(pathname) && userTokenVerified) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
}; 

async function verifyToken(tokenName: string, req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(tokenName);
  console.log(req.cookies,'123457');
  
  if (!token?.value) {
    console.warn(`Token ${tokenName} not found.`);
    return false;
  }

  const secret = process.env.JWT_SECRET || "sanoojsanooj";

  try {
    const { payload } = await jwtVerify(token.value, new TextEncoder().encode(secret));
    return Boolean(payload);
  } catch (err: any) {
    console.error(`Token verification failed for ${tokenName}:`, err.message);
    return false;
  }
}
