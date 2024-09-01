
// Routes Logic

// User Routes
const protectedRoutes = new Set(["/trips"]);
const changeToHomeRoutes = new Set(["/login", "/signup"]);

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.has(pathname);
}

export function toBeRedirectedRoutes(pathname: string): boolean {
  return changeToHomeRoutes.has(pathname);
}

// Admin Routes
const protectedAdminRoutes = new Set(["/admin/dashboard"]);
const changeToAdminRoutes = new Set(["/admin"]);

export function isProtectedAdminRoute(pathname: string): boolean {
  return protectedAdminRoutes.has(pathname);
}

export function toBeRedirectedAdminRoutes(pathname: string): boolean {
  return changeToAdminRoutes.has(pathname);
}

// Vendor Routes
const protectedVendorRoutes = new Set(["/vendordashboard"]);
const changeToVendorRoutes = new Set(["/vendorSignup"]);

export function isProtectedVendorRoute(pathname: string): boolean {
  return protectedVendorRoutes.has(pathname);
}

export function toBeRedirectedVendorRoutes(pathname: string): boolean {
  return changeToVendorRoutes.has(pathname);
}
