"use client";

import { deleteCookie } from "@/utils/deleteCookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

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
    router.push("/"); // Redirect to the home page or login page
  };

  return (
    <nav className="bg-black py-4 px-8 flex justify-between items-center">
      {/* Logo Section */}
      <div className="text-white font-bold">
        <Link href="/">E-vent</Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-8 text-white">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/vendor">Vendor</Link>
        </li>
        <li>
          <Link href="">About</Link>
        </li>
        <li>
          <Link href="">Contact</Link>
        </li>
      </ul>

      {/* Icons and Logout */}
      <div className="flex space-x-4 items-center">
        {/* Notification Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.73 21a2 2 0 01-3.46 0"
          />
        </svg>

        {/* Profile Icon */}
        <svg
          onClick={() => router.push("/profile")}
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 cursor-pointer" // Added cursor-pointer for better UX
          fill="none"
          viewBox="0 0 24 24"
          stroke="white"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c0 1.105-1.343 2-3 2s-3-.895-3-2c0-1.105 1.343-2 3-2s3 .895 3 2z"
          />
        </svg>


        {/* Logout or Login */}
        {isAuthorized ? (
          <span onClick={handleLogoutClick} className="p-2 text-white cursor-pointer">
            Logout
          </span>
        ) : (
          <Link href="/login">
            <span className="text-white">Login</span>
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
