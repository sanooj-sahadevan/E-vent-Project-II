
// User Routes
const protectedUserRoutes = new Set([
  "/profilee", "/auditoriumInfo", "/auditoriumList",
 , "/booknow", "/chat", "/checkout",
  "/dishesinfo", "/vendor", "/googlemap", , '/vendorProfile'
]);

export function isProtectedUserRoute(pathname: string): boolean {
  return protectedUserRoutes.has(pathname);
}

export function toBeRedirectedRoutes(pathname: string): boolean {
  const changeToHomeRoutes = new Set(["/login", "/signup"]);
  return changeToHomeRoutes.has(pathname);
}

// Admin Routes
const protectedAdminRoutes = /^\/admin\/.*$/;
const changeToAdminRoutes = new Set(["/admin"]);

export function isProtectedAdminRoute(pathname: string): boolean {
  return protectedAdminRoutes.test(pathname);
}

export function toBeRedirectedAdminRoutes(pathname: string): boolean {
  return changeToAdminRoutes.has(pathname);
}

// Vendor Routes
const protectedVendorRoutes = new Set([
  "/vendordashboard", "/vendorAddAuditoriums", "/vendorAddDishes",
  "/vendorBookingDetails", "/vendorChat", "/vendorEditProfile"
]);

export function isProtectedVendorRoute(pathname: string): boolean {
  return protectedVendorRoutes.has(pathname);
}

export function toBeRedirectedVendorRoutes(pathname: string): boolean {
  const changeToVendorRoutes = new Set(["/vendorSignup", "/vendorLogin"]);
  return changeToVendorRoutes.has(pathname);
}
