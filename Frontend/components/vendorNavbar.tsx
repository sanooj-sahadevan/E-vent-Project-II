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
    const token = localStorage.getItem("vendorToken");
    const userData = localStorage.getItem("vendor");

    if (token && userData) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleLogoutClick = () => {
    toast.success("Logout Successfully");
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorToken");
    deleteCookie("vendorToken");
    setIsAuthorized(false);
    router.push("/");
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
          <Link href="/about">About</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
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
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c0 1.105-1.343 2-3 2s-3-.895-3-2c0-1.105 1.343-2 3-2s3 .895 3 2z"
          />
        </svg>

        {/* Logout or Login */}
        {isAuthorized ? (
          <span onClick={handleLogoutClick} className="p-2 text-white cursor-pointer">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 002 2h6a2 2 0 002-2v-7a2 2 0 00-2-2h-6a2 2 0 00-2 2v1"
              />
            </svg> */} <p>Log out</p>
          </span>
        ) : (
          <Link href="/login">
            {/* <svg
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v2a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5v-2a.5.5 0 01.5-.5h6a.5.5 0 01.5.5z"
              />
            </svg> */}
            <p>Login</p>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
