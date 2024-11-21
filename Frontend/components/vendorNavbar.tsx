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
import { BellRing, LogIn, LogOut, Send } from "lucide-react";
import { logoutApi } from "@/services/userApi";

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
    const newSocket = io("https://api.eventopia.shop")
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



  const handleLogoutClick = async () => {

    try {
      toast.success("Logout Successfully");

      // const result = await logoutApi();
      // console.log(result);

      localStorage.removeItem("vendor");
      localStorage.removeItem("vendorToken");
      localStorage.removeItem("refreshToken");
      deleteCookie("refreshToken");
      deleteCookie("vendorToken");
      setIsAuthorized(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.", {
        autoClose: 3000,
      });
    }

  };





  return (
    <nav className="bg-black py-4 px-8 flex justify-between items-center">
      {/* Logo Section */}
      <div className="text-white font-bold">
        <Link href="">E-vent</Link>
      </div>

      {/* Navigation Links */}
      <ul className="flex space-x-8 text-white">
        <li>
          <Link href="" >Home</Link>
        </li>
        <li>
          <Link href="">Vendor</Link>
        </li>
        <li>
          <Link href="">About</Link>
        </li>
        <li>
          <Link href="">Contact</Link>
        </li>
      </ul>

      {/* Icons and Logout */}
      <div className="flex space-x-7 items-center">
        {/* Notification Icon */}
        <BellRing color="#ffffff" />

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
              <Send color="#ffffff" />
            </Badge>
          </div>
        </Link>


        {/* Logout or Login */}
        {isAuthorized ? (
          <span onClick={handleLogoutClick} className="p-2 text-white cursor-pointer">
            <LogOut color="#ffffff" />
          </span>
        ) : (
          <Link href="/login">
            <LogIn color="#ffffff" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
