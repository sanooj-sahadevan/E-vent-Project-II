'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PayUComponent from "@/components/payment/payUcomponent";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to store booking details including userId
  const [bookingDetails, setBookingDetails] = useState({
    userId: {
      username: '',
      address: '',
      phone: '',
      _id: '', // _id added here
    },
    category: '',
    date: '',
    eventType: '',
    vendorId: '',
    auditoriumId: '',
    dishesId: '',
    advanceAmount: 10000,  // Default advance amount
  });

  // State to control PayUComponent visibility
  const [showPayUComponent, setShowPayUComponent] = useState(false);

  // Fetch user and query params on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setBookingDetails((prev) => ({
        ...prev,
        userId: {
          username: parsedUser.username || '',
          address: parsedUser.address || '',
          phone: parsedUser.phone || '',
          email: parsedUser.email || '',
          _id: parsedUser._id || '', // _id added here
        },
      }));
    }

    // Extract search params
    const params = {
      category: searchParams.get("category") || '',
      date: searchParams.get("date") || '',
      eventType: searchParams.get("eventType") || '',
      vendorId: searchParams.get("vendorId") || '',
      auditoriumId: searchParams.get("auditoriumId") || '',
      dishesId: searchParams.get("dishesId") || '',
    };

    // Update bookingDetails state with the params
    setBookingDetails((prev) => ({
      ...prev,
      ...params,
    }));
  }, [searchParams]);

  console.log(bookingDetails, 'Booking Details -------------------------------------------------------');

  // Handle showing the PayUComponent
  const handlePayment = () => {
    setShowPayUComponent(true); // Show PayUComponent directly
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10">Checkout</h1>
      <p className="text-center mb-12 text-lg text-gray-600">Confirm your event details and proceed with the payment</p>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-8">
        {/* Left: Price Details */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Price Details</h2>
          {bookingDetails.userId.username && <p className="text-lg text-gray-600 mb-2">User: <span className="font-semibold">{bookingDetails.userId.username}</span></p>}
          {bookingDetails.userId.address && <p className="text-lg text-gray-600 mb-2">Address: <span className="font-semibold">{bookingDetails.userId.address}</span></p>}
          {bookingDetails.userId.phone && <p className="text-lg text-gray-600 mb-2">Phone: <span className="font-semibold">{bookingDetails.userId.phone}</span></p>}
          {bookingDetails.date && <p className="text-lg text-gray-600 mb-2">Event Date: <span className="font-semibold">{bookingDetails.date}</span></p>}
          {bookingDetails.eventType && <p className="text-lg text-gray-600 mb-2">Event Type: <span className="font-semibold">{bookingDetails.eventType}</span></p>}
          {bookingDetails.category && <p className="text-lg text-gray-600 mb-2">Category: <span className="font-semibold capitalize">{bookingDetails.category}</span></p>}
          {bookingDetails.vendorId && <p className="text-lg text-gray-600 mb-2">Vendor ID: <span className="font-semibold">{bookingDetails.vendorId}</span></p>}
          {bookingDetails.auditoriumId && <p className="text-lg text-gray-600 mb-2">Auditorium ID: <span className="font-semibold">{bookingDetails.auditoriumId}</span></p>}

          <div className="my-4">
            <div className="flex justify-between text-lg">
              <p>Advance Amount</p>
              <p className="font-semibold text-gray-800">{bookingDetails.advanceAmount}</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-xl font-semibold text-gray-700">
            <p>Total Payable</p>
            <p>{bookingDetails.advanceAmount}</p>
          </div>
        </div>

        {/* Right: Payment Method */}
        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Click the Button for Payment</h2>

          {/* Total Price and Pay Button */}
          <div className="flex justify-between text-xl font-semibold text-gray-700 mb-4">
            <p>Total</p>
            <p>{bookingDetails.advanceAmount}</p>
          </div>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 w-full rounded-lg font-bold transition-all duration-200"
            onClick={handlePayment}
          >
            Pay Now
          </button>

          {/* Conditionally render the PayUComponent */}
          {showPayUComponent && <PayUComponent BookedData={bookingDetails} />}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
