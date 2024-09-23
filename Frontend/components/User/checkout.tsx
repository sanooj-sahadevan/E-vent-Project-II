/* eslint-disable @next/next/no-img-element */
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Payment } from '@/services/userApi';
// import PayUComponent from '../payment/payUcomponent';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const date = searchParams.get("date");
  const eventType = searchParams.get("eventType");
  const vendorId = searchParams.get("vendorId");
  const auditoriumId = searchParams.get("auditoriumId");

  const [selectedCard, setSelectedCard] = useState<string>('Visa');
  const [user, setUser] = useState<{ username: string; address?: string; phone?: string } | null>(null);
  const [advanceAmount, setAdvanceAmount] = useState<number>(10000); // Default amount

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSubmit = async () => {
    if (user) {
      try {
        const paymentResponse = await Payment(user.username); // Pass the username as a string
        console.log('Payment successful:', paymentResponse);
        // Handle success (e.g., navigate to success page, show confirmation)
      } catch (error) {
        console.error('Payment failed:', error);
        // Handle failure (e.g., show error message to user)
      }
    } else {
      console.error('User not found.');
    }
  };

  // Create the booking details object
  const bookingDetails = {
    username: user?.username,
    category,
    date,
    eventType,
    vendorId,
    auditoriumId,
    advanceAmount
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10">Checkout</h1>
      <p className="text-center mb-12 text-lg text-gray-600">Confirm your event details and proceed with the payment</p>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Left: Price Details */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Price Details</h2>
          
          {user && <p className="text-lg text-gray-600 mb-2">User: <span className="font-semibold">{user.username}</span></p>}
          {date && <p className="text-lg text-gray-600 mb-2">Event Date: <span className="font-semibold">{date}</span></p>}
          {eventType && <p className="text-lg text-gray-600 mb-2">Event Type: <span className="font-semibold">{eventType}</span></p>}
          {category && <p className="text-lg text-gray-600 mb-2">Category: <span className="font-semibold capitalize">{category}</span></p>}
          {vendorId && <p className="text-lg text-gray-600 mb-2">Vendor ID: <span className="font-semibold">{vendorId}</span></p>}

          <div className="my-4">
            <div className="flex justify-between text-lg">
              <p>Advance Amount</p>
              <p className="font-semibold text-gray-800">{advanceAmount}</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-xl font-semibold text-gray-700">
            <p>Total Payable</p>
            <p>{advanceAmount}</p>
          </div>
        </div>

        {/* Right: Payment Method */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Click the Button for Payment</h2>

          {/* Total Price and Pay Button */}
          <div className="flex justify-between text-xl font-semibold text-gray-700 mb-4">
            <p>Total</p>
            <p>{advanceAmount}</p>
          </div>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 w-full rounded-lg font-bold transition-all duration-200"
            onClick={handleSubmit}
          >
            Pay Now
          </button>
          {/* Pass bookingDetails to PayUComponent */}
          {/* <PayUComponent BookedData={bookingDetails} /> */}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
