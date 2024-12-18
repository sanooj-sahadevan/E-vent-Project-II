
"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteCookie } from "@/utils/deleteCookie";
import { useRouter } from "next/navigation";
import { logoutApi } from "@/services/adminAPI";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const router = useRouter();

  // const handleLogoutClick = async() => {

  //   const result = await logoutApi();
  //   console.log(result);

  //   toast.success("Logout Successfully");
  //   localStorage.removeItem("admin");
  //   localStorage.removeItem("adminToken");
  //   deleteCookie("adminToken");
  //   router.push("/"); 
  // };
  const handleLogoutClick = async () => {
    try {
      // Call logout API
      const result = await logoutApi();
      console.log(result);
  
      // Delete the adminToken cookie manually
      document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.eventopia.shop;";
      
      // Clear localStorage and show success message
      toast.success("Logout Successfully");
      localStorage.removeItem("admin");
      localStorage.removeItem("adminToken");
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  const isActive = (path: string) => activePath === path;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Eventopia</h2>
        </div>
        <nav className="mt-10">
          <ul>
            <li className="px-6 py-3">
              <Link
                href="/admin/dashboard"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/dashboard")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="px-5 py-3">
              <Link
                href="/admin/adminUser"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/adminUser")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Users
              </Link>
            </li>
            <li className="px-6 py-3">
              <Link
                href="/admin/adminVendor"
                className={`rounded-lg block text-xl p-3 font-semibold  ${isActive("/admin/adminVendor")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Vendor
              </Link>
            </li>
            <li className="px-6 py-3">
              <Link
                href="/admin/salesReport"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/salesReport")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Sales Report
              </Link>
            </li>
            {/* <li className="px-6 py-3">
              <Link
                href="/admin/transaction"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/transaction")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Transaction
              </Link>
            </li> */}

            <li className="px-6 py-3 mt-12">
              <button
                type="button"
                onClick={handleLogoutClick}
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/logout")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-8">{children}</div>
    </div>
  );
};

export default Layout;
