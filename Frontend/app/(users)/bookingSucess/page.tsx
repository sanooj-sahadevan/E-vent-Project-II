/* eslint-disable react/no-unescaped-entities */
"use client";

import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchBookingDetilsProfile } from "@/services/userApi";

const BookingSuccess: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState<any[]>([]);
  const [latestTransactionId, setLatestTransactionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latestVendor, setLatestVendor] = useState<string | null>(null);
  const [latestuser, setLatestUser] = useState<string | null>(null);
  const [latestamount, setLatestamount] = useState<string | null>(null);

  const [latestCategory, setLatestCategory] = useState<string | null>(null);




  useEffect(() => {
    const fetchBookingDetails = async () => {
      const userString = localStorage.getItem("user");
      const User = userString ? JSON.parse(userString) : null;
      const userId = User ? User._id : null;

      if (userId) {
        try {
          const data = await fetchBookingDetilsProfile(userId);
          console.log({ data }, 'frontend');

          // Sort the data by `createdAt` (latest first)
          const sortedData = data.sort((a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          // Set booking details and extract the latest transaction ID
          setBookingDetails(sortedData);
          if (sortedData.length > 0) {
            setLatestTransactionId(sortedData[0].txnId);
            setLatestVendor(sortedData[0].vendorId.vendorname);
            setLatestUser(sortedData[0].userId.username);
            setLatestamount(sortedData[0].totalAmount);
            setLatestCategory(sortedData[0].category);


          }

          setLoading(false);
        } catch (err: any) {
          setError('Error fetching booking details');
          setLoading(false);
        }
      } else {
        setError('No user data found.');
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between mt-[100px]">
      {/* Navbar at the top */}
      <Navbar />

      {/* Booking Success message in the middle */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Booking Successful!</h2>
          <div className="mb-6 text-center">
            <p className="text-lg font-bold text-gray-700">Transaction ID:</p>
            {/* Display the latest transaction ID */}
            <p className="text-gray-500 text-lg">{latestTransactionId || "Transaction ID not found"}</p>

            <p className="text-lg font-bold text-gray-700 mt-4">Vendor Name:</p>
            <p className="text-gray-500 text-lg">{latestVendor}</p>

            <p className="text-lg font-bold text-gray-700 mt-4">User Name:</p>
            <p className="text-gray-500 text-lg">{latestuser}</p>

            <p className="text-lg font-bold text-gray-700 mt-4">Total Amount:</p>
            <p className="text-gray-500 text-lg">{latestamount}</p>

            <p className="text-lg font-bold text-gray-700 mt-4">Category:</p>
            <p className="text-gray-500 text-lg">{latestCategory}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleRedirect}
              className="w-full bg-pink-500 text-white font-bold py-2 rounded-lg hover:bg-pink-600 transition duration-300"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>




  );
};

export default BookingSuccess;
