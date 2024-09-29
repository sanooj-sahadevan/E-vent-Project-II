import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { deleteCookie } from "@/utils/deleteCookie";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const router = useRouter();

  const handleLogoutClick = () => {
    toast.success("Logout Successfully");
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    deleteCookie("adminToken");
    router.push("/"); // Redirect to the home page or login page
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
          <h2 className="text-2xl font-semibold">E-vent</h2>
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
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/approval")
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
                className={`rounded-lg block text-xl p-3 font-semibold  ${isActive("/admin/transaction")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Vendor
              </Link>
            </li>
            <li className="px-6 py-3">
              <Link
                href="/admin/adminVendor"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/users")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Sales Report
              </Link>
            </li>
            <li className="px-6 py-3">
              <Link
                href="/admin/alesreport"
                className={`rounded-lg block text-xl p-3 font-semibold ${isActive("/admin/company")
                    ? "bg-pink-700 text-white"
                    : "hover:bg-gray-200"
                  }`}
              >
                Transaction
              </Link>
            </li>

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
