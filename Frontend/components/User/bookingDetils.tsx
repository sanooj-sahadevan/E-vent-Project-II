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
  const [currentPage, setCurrentPage] = useState<number>(1); // State for current page
  const [totalPages, setTotalPages] = useState<number>(1); // State for total pages

  const itemsPerPage = 6;

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
      setTotalPages(Math.ceil(data.length / itemsPerPage)); // Calculate total pages
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

  // Pagination logic to get the events for the current page
  const getPaginatedEvents = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return bookingDetails.slice(startIndex, endIndex);
  };

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
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-black rounded-lg">
              <thead>
                <tr className="bg-white text-black border-b border-black">
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
                {getPaginatedEvents().length > 0 ? (
                  getPaginatedEvents().map((event, index) => (
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
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-4">
            <button
              className="px-4 py-2 mx-2 bg-white border border-black text-black rounded hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 mx-2 text-black">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 mx-2 bg-white border border-black text-black rounded hover:bg-gray-100"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>



  );
};

export default EventsPage;
