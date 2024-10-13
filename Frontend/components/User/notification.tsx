'use client'; // Moved 'use client' to the top
import { NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';

interface Notification {
  id: number;
  avatar: string;
  name: string;
  action: string;
  post: string;
  time: string;
  message?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    avatar: '/avatar1.jpg', // Ensure this image exists in the 'public' folder
    name: 'John Doe',
    action: 'liked your post',
    post: 'My new blog post',
    time: '2 hours ago',
    message: 'Nice post!',
  },
  {
    id: 2,
    avatar: '/avatar2.jpg', // Ensure this image exists in the 'public' folder
    name: 'Jane Smith',
    action: 'commented on your post',
    post: 'My new blog post',
    time: '4 hours ago',
    message: 'Great insights!',
  },
];

const NotificationsPage: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="max-w-md mx-auto mt-1 w-full h-[500px] bg-white rounded-lg shadow-md pt-10 pb-20">
      <div className="flex justify-between items-center mb-4">
        {/* <h2 className="text-xl font-semibold">Notifications</h2> */}
        <button className="text-blue-500 text-sm">Mark all as read</button>
      </div>
      <div className="space-y-4 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-center space-x-3 p-2 border rounded-lg">
            <Image src={notification.avatar} alt={notification.name} width={40} height={40} className="rounded-full" />
            <div>
              <p className="text-sm">
                <span className="font-semibold">{notification.name}</span> {notification.action} on{' '}
                <span className="font-semibold">{notification.post}</span>
              </p>
              <p className="text-xs text-gray-500">{notification.time}</p>
              {notification.message && <p className="text-sm">{notification.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default NotificationsPage;
