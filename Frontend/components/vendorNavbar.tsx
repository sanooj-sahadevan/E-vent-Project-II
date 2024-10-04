/* eslint-disable react/jsx-no-undef */
"use client";

import { deleteCookie } from "@/utils/deleteCookie";
import { getUnreadMessagesCountAPI } from "@/services/vendorAPI";
import { Badge } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io, Socket } from "socket.io-client";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [vendorId, setVendorId] = useState<string | null>(null); // Store vendorId

  useEffect(() => {
    const vendorData = localStorage.getItem("vendor");
    if (vendorData) {
      const parsedVendor = JSON.parse(vendorData);
      const vendorId = parsedVendor._id;
      setVendorId(vendorId);
    }
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("unreadCount", (response: any) => {
      console.log("Unread count received:", response);
      setUnreadMessagesCount(response.unreadCount);
    });

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && vendorId) {
      console.log(`Joining vendor room: ${vendorId}`);
      socket.emit("joinRoom", vendorId);
    }
  }, [vendorId, socket]);




  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await getUnreadMessagesCountAPI();
        console.log(response);
        
        if (response && typeof response.unreadCount === 'number') {
          setUnreadMessagesCount(response.unreadCount);
        } else {
          console.error("Unread count not available in response", response);
        }
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };
  
    fetchUnreadMessages();
  }, []);
  
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
          <Link href="/vendordashboard" >Home</Link>
        </li>
        <li>
          <Link href="/vendordashboard">Vendor</Link>
        </li>
        <li>
          <Link href="/">About</Link>
        </li>
        <li>
          <Link href="/">Contact</Link>
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

        {/* Chat Icon */}
        <Link href="/vendorChat">
          <div className="relative">
            <Badge
              badgeContent={unreadMessagesCount}
              color="secondary"
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
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
                  d="M7 8h10M7 12h4m1 8v2a2 2 0 01-2 2h-6a2 2 0 01-2-2v-2m10-4h4a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h4"
                />
              </svg>
            </Badge>
          </div>
        </Link>

        {/* Logout or Login */}
        {isAuthorized ? (
          <span onClick={handleLogoutClick} className="p-2 text-white cursor-pointer">
            <p>Log out</p>
          </span>
        ) : (
          <Link href="/login">
            <p>Login</p>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
