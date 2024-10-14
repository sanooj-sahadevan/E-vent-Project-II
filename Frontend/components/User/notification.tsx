'use client';
import { useEffect, useState } from 'react';
import { fetchNotification } from '@/services/userApi';

interface Notification {
  createdAt: string;
  notificationMessage: string;
  _id: string;
  post: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Fetch userId from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUserId(parsedUser._id);
    }
  }, []);

  // Fetch notifications when userId is set
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userId) {
        setLoading(true);
        try {
          const fetchedNotifications = await fetchNotification(userId);
          console.log(fetchedNotifications.notification, 'notiii');
          setNotifications(fetchedNotifications.notification);
        } catch (error) {
          setError('Failed to fetch notifications');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotifications();
  }, [userId]);

  // Handle marking all as read
  const handleMarkAllAsRead = () => {
    setNotifications([]); // Clear notifications array
  };

  return (
    <div className="max-w-md mx-auto mt-1 w-full h-[500px] bg-white rounded-lg shadow-md pt-10 pb-20">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="text-blue-500 text-sm"
          onClick={handleMarkAllAsRead} // Add the click handler here
        >
          Mark all as read
        </button>
      </div>
      <div className="space-y-4 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : notifications.length > 0 ? (
          notifications.map((notification) => (
            <div key={notification._id} className="flex items-center space-x-3 p-2 border rounded-lg">
              <div>
                <p className="text-sm">
                  <span className="font-semibold">{notification.post}</span>
                </p>
                <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                {notification.notificationMessage && <p className="text-sm">{notification.notificationMessage}</p>}
              </div>
            </div>
          ))
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
