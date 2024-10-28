/* eslint-disable react/jsx-no-undef */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
"use client";

import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchBookingDetilsProfile } from "@/services/userApi";
import Image from 'next/image';
import img from '@/public/four.jpg';

interface BookingDetail {
  txnId: string;
  vendorId: { vendorname: string };
  userId: { username: string };
  totalAmount: string;
  category: string;
  createdAt: string;
}

const BookingSuccess: React.FC = () => {
  const router = useRouter();
  
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [latestTransactionId, setLatestTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;
      const userId = user ? user._id : null;

      if (userId) {
        try {
          const data: BookingDetail[] = await fetchBookingDetilsProfile(userId);
          console.log({ data }, 'frontend');

          const sortedData = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setBookingDetails(sortedData);
          if (sortedData.length > 0) {
            const latestDetail = sortedData[0];
            setLatestTransactionId(latestDetail.txnId);
          }
        } catch (err) {
          console.error("Error fetching booking details:", err);
          setError('Error fetching booking details. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('No user data found.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
    
    return () => {
      localStorage.removeItem('auditoriumId');
      localStorage.removeItem('dishesId');
      console.log('auditoriumId and dishesId have been removed from local storage.');
    };
  }, []);

  const handleRedirect = () => {
    router.push('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Booking Confirmation Section */}
      <div className="flex-grow flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-4xl flex items-center space-x-12">
          
          {/* Booking Info Image */}
          <div className="w-1/2">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <Image 
                src={img}
                alt="Event" 
                className="object-cover w-full h-full"
              />
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Your Event has been Booked!</h2>
            <p className="text-lg text-gray-600">A Vibrant Tapestry of Culture and History</p>
            
            {/* Dates and Traveler Info */}
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">Dates</p>
                <p>{bookingDetails[0]?.createdAt || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">User Name</p>
                <p>{bookingDetails[0]?.userId.username || "N/A"} </p>
              </div>
            </div>
            
            {/* Reservation Details */}
            <div className="bg-white p-4 rounded-lg shadow-md text-gray-700 space-y-2">
              <p className="font-semibold">Reserve Details</p>
              <p>Booking Code: <span className="font-medium">{latestTransactionId || "N/A"}</span></p>
              <p>Date: {bookingDetails[0].createdAt || "N/A"}</p>
              <p>Payment Method: Pay U</p>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                onClick={handleRedirect}
                className="w-full bg-pink-400 text-white font-bold py-2 rounded-lg shadow-lg hover:bg-pink-800 transition duration-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default BookingSuccess;
