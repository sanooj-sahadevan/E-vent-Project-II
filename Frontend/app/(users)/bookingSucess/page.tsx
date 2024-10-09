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


    <div className="min-h-screen flex flex-col justify-between mt-[100px] bg-gray-50">
      {/* Navbar at the top */}
      <Navbar />

      {/* Booking Success message in the middle */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Booking Successful!</h2>

          {/* Transaction details section */}
          <div className="space-y-6 text-center">
            <div>
              <p className="text-sm font-semibold text-gray-600">Transaction ID</p>
              <p className="text-xl font-medium text-gray-800 mt-1">{latestTransactionId || "Not available"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Vendor Name</p>
              <p className="text-lg text-gray-700 mt-1">{latestVendor || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">User Name</p>
              <p className="text-lg text-gray-700 mt-1">{latestuser || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Total Amount</p>
              <p className="text-lg text-gray-700 mt-1">{latestamount || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Category</p>
              <p className="text-lg text-gray-700 mt-1">{latestCategory || "N/A"}</p>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-8">
            <button
              onClick={handleRedirect}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-2 rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transition duration-300"
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
