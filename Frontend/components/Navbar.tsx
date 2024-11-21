/* eslint-disable react/jsx-no-undef */
"use client";

import { logoutApi } from "@/services/userApi";
import { deleteCookie } from "@/utils/deleteCookie";
import { BellRing, LogOut, ScanFace, UserRoundPen } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";


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

  // const handleLogoutClick = () => {
  //   toast.success("Logout Successfully", {
  //     duration: 3000, 
  //   });
  //   localStorage.removeItem("user");
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("refreshToken");
  //   deleteCookie("token");
  //   deleteCookie("refreshToken");
  //   let result   = await LogOut()
  //   console.log(result);


  //   setIsAuthorized(false);
  //   router.push("/");
  // };


  const handleLogoutClick = async () => {
    try {
      toast.success("Logout Successfully", {
        duration: 3000,
      });

      // API Call for logout
      const result = await logoutApi();
      console.log(result);

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      deleteCookie("token");
      deleteCookie("refreshToken");
      setIsAuthorized(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.", {
        duration: 3000,
      });
    }
  };







  const isActive = (path: string) => activePath === path;

  return (
    <nav className="bg-black py-4 px-8 flex justify-between items-center fixed top-0 w-full z-10">
      {/* Logo Section */}
      <div className="text-white custom-font">
        <Link href="/">EVENTOPIA</Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-6 text-white">
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
      <div className="flex space-x-7 items-center">
        {/* Notification Icon */}
        <BellRing onClick={() => router.push("/notification")} className="w-5 h-5 text-white" />

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
