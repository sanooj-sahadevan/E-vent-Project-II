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
  const [bookingDetails, setBookingDetails] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = bookingDetails.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(bookingDetails.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="container mx-auto p-12">
      <h2 className="text-2xl font-bold mb-4 text-center">Booking Details</h2>

      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p className="text-gray-700">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-black border rounded-lg">
            <thead>
              <tr className="bg-white text-black border-black">
                <th className="p-4 border-black">Date</th>
                <th className="p-4 border-black">Vendor Name</th>
                <th className="p-4 border-black">Auditorium Name</th>
                <th className="p-4 border-black">Dishes Name</th>
                <th className="p-4 border-black">Transaction ID</th>
                <th className="p-4 border-black">Payment Status</th>
                <th className="p-4 border-black">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((event, index) => (
                  <tr key={index} className="border-b border-black">
                    <td className="p-4 border-black">{formatDate(event.createdAt)}</td>
                    <td className="p-4 border-black">{event.vendorId?.vendorname || 'N/A'}</td>
                    <td className="p-4 border-black">{event.auditoriumId?.auditoriumName || 'N/A'}</td>
                    <td className="p-4 border-black">{event.dishesId?.dishesName || 'N/A'}</td>
                    <td className="p-4 border-black">{event.txnId}</td>
                    <td className="p-4 border-black">{event.paymentStatus}</td>
                    <td className="p-4 border-black">{event.totalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              className={`px-4 py-2 border-black border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`px-4 py-2 border-black border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
