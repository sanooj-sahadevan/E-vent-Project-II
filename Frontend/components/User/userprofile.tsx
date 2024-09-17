// components/TopNavBar.tsx

import { FaUser, FaLock, FaHeart, FaBell, FaComments } from 'react-icons/fa';
import Link from 'next/link';

const TopNavBar = () => {
  return (
<nav className="bg-white-100 p-4 shadow-md mt-[100px]">
<ul className="flex space-x-6 justify-center">
        <li>
          <Link href="/profile" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaUser size={24} />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link href="/profile/booking-details" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaLock size={24} />
            <span>Booking Details</span>
          </Link>
        </li>
        <li>
          <Link href="/change-password" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaLock size={24} />
            <span>Change Password</span>
          </Link>
        </li>
        <li>
          <Link href="/favourites" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaHeart size={24} />
            <span>Favourites</span>
          </Link>
        </li>
        <li>
          <Link href="/notifications" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaBell size={24} />
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link href="/chat" className="flex flex-col items-center text-gray-600 hover:text-pink-500">
            <FaComments size={24} />
            <span>Chat</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default TopNavBar;
