"use client"

import { useEffect, useState } from 'react';
import {  useRouter } from 'next/navigation';
import axios from 'axios';
import { fetchBookedData } from '@/services/userApi';
import { useParams } from 'next/navigation';

interface BookingDetails {
  txnId: string;
  tripId: {tripName: string};
}

const BookingSuccess: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const  id  = params.id; 
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (id) {
      
//       const fetchBookingDetails = async () => {
//         try {
//           const response = await fetchBookedData(id); 
//           console.log(response);
          
//           setBookingDetails(response);
//           setLoading(false);
//         } catch (err) {
//           console.error("Error fetching booking details:", err);
//           setError("Failed to fetch booking details.");
//           setLoading(false);
//         }
//       };

//       fetchBookingDetails();
//     }
//   }, [id]);

  const handleRedirect = () => {
    router.push('/');
  };

//   if (loading) {
//     return <div className="text-center">Loading...</div>; // Loading state
//   }

//   if (error) {
//     return <div className="text-center text-red-500">{error}</div>; // Error state
//   }

//   if (!bookingDetails) {
//     return <div className="text-center">No booking details available.</div>;
//   }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Booking Successful!</h2>
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">Transaction ID:</p>
          {/* <p className="text-gray-700">{bookingDetails.txnId}</p> */}
        </div>
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">Trip Name:</p>
          {/* <p className="text-gray-700">{bookingDetails.tripId.tripName}</p> */}
        </div>
        <div className="mt-6">
          <button
            onClick={handleRedirect}
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;