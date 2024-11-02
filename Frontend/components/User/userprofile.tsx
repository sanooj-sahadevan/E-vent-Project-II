"use client";
import { FaUser, FaLock, FaBell, FaComments } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Badge from '@mui/material/Badge'; 
import { userGetUnreadMessagesCountAPI } from "@/services/userApi";
import { io, Socket } from "socket.io-client";


const TopNavBar = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);



  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parseduser = JSON.parse(userData);
      const userId = parseduser._id;
      setUserId(userId);
    }
  }, []);

  useEffect(() => {
    const newSocket = io("https://e-vent-project-ii.onrender.com");
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
    if (socket && userId) {
      console.log(`Joining vendor room: ${userId}`);
      socket.emit("joinRoom", userId);
    }
  }, [userId, socket]);



  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        if (userId) {
          const response = await userGetUnreadMessagesCountAPI(userId);  
          console.log('Unread messages response:', response);
          
          if (response && typeof response.unreadCount === 'number') {
            setUnreadMessagesCount(response.unreadCount);
          } else {
            console.error("Unread count not available in response", response);
          }
        }
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    };
  
    fetchUnreadMessages();
  }, [userId]);
  

  const isActive = (path: string) => activePath === path;

  return (
    <nav className="bg-white-100 p-4 shadow-md mt-[100px]">
      <ul className="flex justify-center">
        <li className="mr-8">
          <Link
            href="/profile"
            onClick={() => setActivePath('/profile')}
            className={`flex flex-col items-center ${isActive('/profile') ? 'text-pink-500' : 'text-gray-600'} hover:text-pink-500`}
          >
            <FaUser size={24} />
            <span>Profile</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link
            href="/bookingDetails"
            onClick={() => setActivePath('/bookingDetails')}
            className={`flex flex-col items-center ${isActive('/bookingDetails') ? 'text-pink-500' : 'text-gray-600'} hover:text-pink-500`}
          >
            <FaLock size={24} />
            <span>Booking Details</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link
            href="/changePassword"
            onClick={() => setActivePath('/changePassword')}
            className={`flex flex-col items-center ${isActive('/changePassword') ? 'text-pink-500' : 'text-gray-600'} hover:text-pink-500`}
          >
            <FaLock size={24} />
            <span>Change Password</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link
            href="/notification"
            onClick={() => setActivePath('/notification')}
            className={`flex flex-col items-center ${isActive('/notification') ? 'text-pink-500' : 'text-gray-600'} hover:text-pink-500`}
          >
            <FaBell size={24} />
            <span>Notifications</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link
            href="/allChat"
            onClick={() => setActivePath('/chat')}
            className={`flex flex-col items-center ${isActive('/chat') ? 'text-pink-500' : 'text-gray-600'} hover:text-pink-500`}
          >
            <Badge
              badgeContent={unreadMessagesCount}
              color="secondary"
              overlap="circular"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <FaComments size={24} />
            </Badge>
            <span>Chat</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavBar;
