'use client';

import React, { useState, useEffect } from 'react';
import { fetchBookingDetilsProfile } from '@/services/userApi';

// Define the types for the event data
interface Event {
  createdAt: string;  // Updated to reflect the correct timestamp field
  productinfo: string;
  txnId: string;
  paymentStatus: string;
  totalAmount: number;
  status: 'Pending' | 'Complete';
}

const EventsPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<Event[]>([]); // State for booking details
  const [loading, setLoading] = useState<boolean>(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error messages

  const fetchDetails = async (userId: string | null) => {
    if (!userId) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchBookingDetilsProfile(userId);
      setBookingDetails(data);
      setLoading(false);
    } catch (err: any) {
      setError('Error fetching booking details');
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        const userId = user?._id; // Safely access user._id
        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }
        fetchDetails(userId);
      } catch (err) {
        setError('Failed to parse user data from localStorage');
        setLoading(false);
      }
    } else {
      setError('No user found in localStorage');
      setLoading(false);
    }
  }, []);

  // Format the date for readability
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-12">
<h2 className="text-2xl font-bold mb-4 text-center">Booking Details</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-100 border rounded-lg">
            <thead>
              <tr className="bg-gray-300 text-left">
                <th className="p-4">Date</th>
                <th className="p-4">Event Name</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Total Amount</th>
                {/* <th className="p-4">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{formatDate(event.createdAt)}</td>
                    <td className="p-4">{event.productinfo}</td>
                    <td className="p-4">{event.txnId}</td>
                    <td className="p-4">{event.paymentStatus}</td>
                    <td className="p-4">{event.totalAmount}</td>
                    <td className="p-4">
                      {/* <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-600"
                      >
                        {event.status === 'Complete' ? 'Add Review' : 'N/A'}
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        &#10006;
                      </button> */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-4">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
