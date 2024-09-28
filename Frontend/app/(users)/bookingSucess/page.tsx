/* eslint-disable react/no-unescaped-entities */
"use client";

import Footer from '@/components/footer';
import Navbar from '@/components/Navbar';
import { useRouter, useSearchParams } from 'next/navigation';

const BookingSuccess: React.FC = () => {
  const searchParams = useSearchParams();
  
  // Retrieve the PayUOrderId from query parameters
  const PayUOrderId = searchParams.get('PayUOrderId');
  
  // Log the PayUOrderId to the console
  console.log('PayUOrderId:', PayUOrderId,'8888888888888888888888888888888888888888888888888888');

  const router = useRouter();

  // Handle redirect to the homepage
  const handleRedirect = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between mt-[100px]">
      {/* Navbar at the top */}
      <Navbar />

      {/* Booking Success message in the middle */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">Booking Successful!</h2>
          <div className="mb-4 text-center">
            <p className="text-lg font-medium">Transaction ID:</p>
            {/* Display the dynamic PayUOrderId */}
            <p className="text-gray-700">{PayUOrderId || "Transaction ID not found"}</p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleRedirect}
              className="w-full bg-pink-500 text-white font-semibold py-2 rounded-lg hover:bg-pink-600 transition duration-300"
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
