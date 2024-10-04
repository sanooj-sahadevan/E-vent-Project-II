'use client';

import React, { useState, useEffect } from 'react';
import { fetchBookingDetilsProfile } from '@/services/userApi';

// Define the types for the booking data
interface Event {
  createdAt: string;
  vendorId: {
    vendorname: string; 
  };
  auditoriumId: {
    auditoriumName: string;  
  };
  dishesId: {
    dishesName: string; 
  };
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
      console.log({ data }, 'frondned');

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
        const userId = user?._id; 
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
                <th className="p-4">Vendor Name</th>
                <th className="p-4">Auditorium Name</th>
                <th className="p-4">Dishes Name</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookingDetails.length > 0 ? (
                bookingDetails.map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{formatDate(event.createdAt)}</td>
                    <td className="p-4">{event.vendorId?.vendorname || 'N/A'}</td>
                    <td className="p-4">{event.auditoriumId?.auditoriumName || 'N/A'}</td>
                    <td className="p-4">{event.dishesId?.dishesName || 'N/A'}</td>
                    <td className="p-4">{event.txnId}</td>
                    <td className="p-4">{event.paymentStatus}</td>
                    <td className="p-4">{event.totalAmount}</td>
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
