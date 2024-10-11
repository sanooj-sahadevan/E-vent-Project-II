"use client";
import React, { useState, useEffect } from 'react';
import { fetchBookingDetilsProfile } from '@/services/userApi';
import { differenceInDays, startOfDay } from 'date-fns';
import ReviewModal from '@/components/User/review'; 

interface Event {
  date: string;
  createdAt: string;
  vendorId: {
    vendorname: string;
    _id: string; // Add vendor ID here
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
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 6;

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // Selected event for review

  const fetchDetails = async (userId: string | null) => {
    if (!userId) {
      setError('User ID is missing');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchBookingDetilsProfile(userId);
      console.log({ data }, 'frontend');

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

  // Format the date for readability, without time
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if the event date has passed or is upcoming
  const getEventStatus = (eventDate: string) => {
    const eventDateObj = startOfDay(new Date(eventDate)); // Start of day for event date
    const currentDate = startOfDay(new Date()); // Start of current day
    const daysDifference = differenceInDays(eventDateObj, currentDate);

    if (daysDifference > 0) {
      return { status: `Upcoming in ${daysDifference} days`, canReview: false };
    } else if (daysDifference === 0) {
      return { status: 'Happening today', canReview: false };
    } else {
      return { status: 'Add Review', canReview: true };
    }
  };

  const handleAddReview = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true); // Open the modal
  };

  const handleModalSubmit = (review: string, rating: number) => {
    console.log('Review submitted', { review, rating, event: selectedEvent });
    setIsModalOpen(false);
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
                  <th className="p-4 border-black">Event Date</th>
                  <th className="p-4 border-black">Vendor Name</th>
                  <th className="p-4 border-black">Auditorium Name</th>
                  <th className="p-4 border-black">Dishes Name</th>
                  <th className="p-4 border-black">Transaction ID</th>
                  <th className="p-4 border-black">Payment Status</th>
                  <th className="p-4 border-black">Total Amount</th>
                  <th className="p-4 border-black">Action</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedEvents().length > 0 ? (
                  getPaginatedEvents().map((event, index) => {
                    const { status, canReview } = getEventStatus(event.date);
                    return (
                      <tr key={index} className="border-b border-black">
                        <td className="p-4 border-black">{formatDate(event.date)}</td>
                        <td className="p-4 border-black">{event.vendorId?.vendorname || 'N/A'}</td>
                        <td className="p-4 border-black">{event.auditoriumId?.auditoriumName || 'N/A'}</td>
                        <td className="p-4 border-black">{event.dishesId?.dishesName || 'N/A'}</td>
                        <td className="p-4 border-black">{event.txnId}</td>
                        <td className="p-4 border-black">{event.paymentStatus}</td>
                        <td className="p-4 border-black">{event.totalAmount}</td>
                        <td className="p-4 border-black">
                          {canReview ? (
                            <button
                              className="bg-pink-500 text-white px-4 py-2 rounded"
                              onClick={() => handleAddReview(event)}
                            >
                              {status}
                            </button>
                          ) : (
                            status
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No booking details available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 text-black rounded mx-2"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 text-black rounded mx-2"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Render the modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={(review, rating) => handleModalSubmit(review, rating)}
        vendorId={selectedEvent?.vendorId?._id || ''} 
      />


    </div>
  );
};

export default EventsPage;
