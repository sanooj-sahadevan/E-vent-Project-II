// "use client"components/TopNavBar.tsx
"use client"
import { FaUser, FaLock, FaBell, FaComments } from 'react-icons/fa';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const TopNavBar = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string | null>(null);


  const isActive = (path: string) => activePath === path;

  return (
    <nav className="bg-white-100 p-4 shadow-md mt-[100px]">
      <ul className="flex justify-center">
        <li className="mr-8">
          <Link href="/profile" onClick={() => setActivePath('/profile')} className={`flex flex-col items-center ${isActive("/profile") ? "text-pink-500" : "text-gray-600"} hover:text-pink-500`}>
            <FaUser size={24} />
            <span>Profile</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link href="/bookingDetails" onClick={() => setActivePath('/bookingDetails')} className={`flex flex-col items-center ${isActive("/bookingDetails") ? "text-pink-500" : "text-gray-600"} hover:text-pink-500`}>
            <FaLock size={24} />
            <span>Booking Details</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link href="/changePassword" onClick={() => setActivePath('/changePassword')} className={`flex flex-col items-center ${isActive("/changePassword") ? "text-pink-500" : "text-gray-600"} hover:text-pink-500`}>
            <FaLock size={24} />
            <span>Change Password</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link href="/notifications" onClick={() => setActivePath('/notifications')} className={`flex flex-col items-center ${isActive("/notifications") ? "text-pink-500" : "text-gray-600"} hover:text-pink-500`}>
            <FaBell size={24} />
            <span>Notifications</span>
          </Link>
        </li>
        <li className="mr-8">
          <Link href="/allChat" onClick={() => setActivePath('/chat')} className={`flex flex-col items-center ${isActive("/chat") ? "text-pink-500" : "text-gray-600"} hover:text-pink-500`}>
            <FaComments size={24} />
            <span>Chat</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavBar;
