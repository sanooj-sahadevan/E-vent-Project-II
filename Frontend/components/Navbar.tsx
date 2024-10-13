"use client";

import { deleteCookie } from "@/utils/deleteCookie";
import { BellRing, LogOut, ScanFace, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar: React.FC = () => {
  const [activePath, setActivePath] = useState<string | null>(null);

  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleLogoutClick = () => {
    toast.success("Logout Successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    deleteCookie("token");
    setIsAuthorized(false);
    router.push("/");
  };

  const isActive = (path: string) => activePath === path;

  return (
    <nav className="bg-black py-4 px-8 flex justify-between items-center fixed top-0 w-full z-10">
      {/* Logo Section */}
      <div className="text-white font-bold">
        <Link href="/">E-vent</Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-white"> {/* Reduced space between links */}
        <li>
          <Link
            href="/"
            className={`${isActive("/") ? "text-pink-500" : "text-white"}`}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            href="/vendor"
            className={`${isActive("/vendor") ? "text-pink-500" : "text-white"}`}
          >
            Vendor
          </Link>
        </li>
        <li>
          <Link
            href="/about"
            className={`${isActive("/about") ? "text-pink-500" : "text-white"}`}
          >
            About
          </Link>
        </li>
        <li>
          <Link
            href="/contactus"
            className={`${isActive("/contactus") ? "text-pink-500" : "text-white"}`}
          >
            Contact
          </Link>
        </li>
      </ul>

      {/* Icons and Logout */}
      <div className="flex space-x-7 items-center"> {/* Reduced spacing between icons */}
        {/* Notification Icon */}
        <BellRing className="w-5 h-5 text-white" /> {/* Reduced icon size */}

        {/* Profile Icon */}
        <UserRoundPen
          onClick={() => router.push("/profile")}
          className="w-5 h-5 text-white cursor-pointer" 
        />

        {/* Logout or Login */}
        {isAuthorized ? (
          <LogOut
            onClick={handleLogoutClick}
            className="w-5 h-5 text-white cursor-pointer"
          />
        ) : (
          <Link href="/login">
            <ScanFace className="w-5 h-5 text-white" /> 
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
