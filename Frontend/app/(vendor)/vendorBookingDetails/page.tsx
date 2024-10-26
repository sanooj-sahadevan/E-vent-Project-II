/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import VendorNavbar from '@/components/vendorNavbar';
import VendorMain from '@/components/Vendor/vendorMain';
import Footer from '@/components/footer';
import { useState, useEffect } from 'react';
import { vendorBookingDetils } from '@/services/vendorAPI'; 

interface Event {
  totalAmount: number;
  createdAt: string;
  eventName: string;
  vendorId: {
    vendorname: string;
  };
  auditoriumId: { auditoriumName: string };
  dishesId: { dishesName: string };
  status: 'Pending' | 'Complete';
  paymentStatus: string;
}

const VendorDashboard = () => {
  const [bookingDetails, setBookingDetails] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // For pagination
  const [itemsPerPage] = useState<number>(5); // Limit of 5 items per page

  const fetchDetails = async (vendorId: string | null) => {
    if (!vendorId) {
      setError('Vendor ID is missing');
      setLoading(false);
      return;
    }

    try {
      const data = await vendorBookingDetils(vendorId);
      console.log({ data }, 'frontend');

      setBookingDetails(data);
      setLoading(false);
    } catch (err: any) {
      setError('Error fetching booking details');
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedVendor = localStorage.getItem('vendor');
    if (storedVendor) {
      try {
        const vendor = JSON.parse(storedVendor);
        const vendorId = vendor?._id;
        if (!vendorId) {
          setError('Vendor ID not found');
          setLoading(false);
          return;
        }
        fetchDetails(vendorId);
      } catch (err) {
        setError('Failed to parse vendor data from localStorage');
        setLoading(false);
      }
    } else {
      setError('No vendor found in localStorage');
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
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <VendorNavbar />
      <VendorMain />

      {/* Booking Details Heading */}
      <div className="px-8 py-5">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-5">Booking Details</h2>

        <div className="flex justify-center py-10">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : loading ? (
            <p className="text-gray-700">Loading...</p>
          ) : (
            <div>
              <table className="min-w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                <thead>
                  <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Auditorium
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Food
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((event, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{formatDate(event.createdAt)}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event.vendorId.vendorname}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event.auditoriumId.auditoriumName}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event.dishesId.dishesName}</td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                        <span className={event.status === 'Pending' ? 'text-blue-500' : 'text-green-500'}>{event.paymentStatus}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">{event.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="flex justify-between mt-5">
                <button
                  onClick={handlePrevPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {/* <span className="text-gray-600">Page {currentPage} of {totalPages}</span> */}
                <button
                  onClick={handleNextPage}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VendorDashboard;
