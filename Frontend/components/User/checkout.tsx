/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PayUComponent from "@/components/payment/payUcomponent";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  console.log(searchParams, 'params');

  const [bookingDetails, setBookingDetails] = useState({
    userId: {
      username: '',
      address: '',
      phone: '',
      _id: '',
    },
    category: '',
    StartingDate: '', EndingDate: '',

    eventType: '',
    vendorId: '',
    auditoriumId: '',
    dishesId: '',
    advanceAmount: 10000,
  });

  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

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
          _id: parsedUser._id || '',
        },
      }));
    }

    const params = {
      category: searchParams.get("category") || '',
      StartingDate: searchParams.get("StartingDate") || '',
      EndingDate: searchParams.get("EndingDate") || '',
      eventType: searchParams.get("eventType") || '',
      vendorId: searchParams.get("vendorId") || '',
      auditoriumId: searchParams.get("auditoriumId") || '',


      dishesId: searchParams.get("dishesId") || '',
    };

    let advanceAmount = 10000;
    if (params.category === 'platinum') {
      advanceAmount = 20000;
    } else if (params.category === 'gold') {
      advanceAmount = 15000;
    } else if (params.category === 'silver') {
      advanceAmount = 1000;
    }

    setBookingDetails((prev) => ({
      ...prev,
      ...params,
      advanceAmount,
    }));
  }, [searchParams]);

  useEffect(() => {
    console.log(bookingDetails, 'Booking Details ---');
  }, [bookingDetails]);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6">Checkout</h1>
    <p className="text-center mb-10 text-lg text-gray-600">Confirm your event details and proceed with the payment</p>
  
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10">
      {/* Left: Price Details */}
      <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Price Details</h2>
  
        <div className="space-y-4">
          {bookingDetails.userId.username && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">User:</span> {bookingDetails.userId.username}
            </p>
          )}
          {bookingDetails.userId.address && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Address:</span> {bookingDetails.userId.address}
            </p>
          )}
          {bookingDetails.userId.phone && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Phone:</span> {bookingDetails.userId.phone}
            </p>
          )}
          {bookingDetails.StartingDate && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Event Starting Date:</span> {bookingDetails.StartingDate}
            </p>
          )}
          {bookingDetails.EndingDate && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Event Ending Date:</span> {bookingDetails.EndingDate}
            </p>
          )}
          {bookingDetails.eventType && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Event Type:</span> {bookingDetails.eventType}
            </p>
          )}
          {bookingDetails.category && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Category:</span> {bookingDetails.category}
            </p>
          )}
          {bookingDetails.vendorId && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Vendor ID:</span> {bookingDetails.vendorId}
            </p>
          )}
          {bookingDetails.auditoriumId && (
            <p className="text-lg text-gray-700">
              <span className="font-medium">Auditorium ID:</span> {bookingDetails.auditoriumId}
            </p>
          )}
        </div>
  
        <div className="mt-6">
          <div className="flex justify-between text-lg text-gray-700">
            <p>Advance Amount</p>
            <p className="font-medium">{bookingDetails.advanceAmount}</p>
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="flex justify-between text-xl font-semibold text-gray-800">
            <p>Total Payable</p>
            <p>{bookingDetails.advanceAmount}</p>
          </div>
        </div>
      </div>
  
      {/* Right: Payment Method */}
      <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Enable Payment</h2>
  
        {/* Toggle for Payment Method */}
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id="paymentToggle"
            checked={isPaymentEnabled}
            onChange={() => setIsPaymentEnabled(!isPaymentEnabled)}
            className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label htmlFor="paymentToggle" className="text-lg text-gray-700">
            Enable Payment
          </label>
        </div>
  
        {/* Conditionally render the PayUComponent */}
        {isPaymentEnabled && (
          <div className="mt-4">
            <PayUComponent BookedData={bookingDetails} />
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default CheckoutPage;