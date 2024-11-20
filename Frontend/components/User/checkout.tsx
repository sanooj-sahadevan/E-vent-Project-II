'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PayUComponent from "@/components/payment/payUcomponent";
import { dateAvailability, getSlotsByWorkerAPI } from '@/services/vendorAPI';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookingDetails, setBookingDetails] = useState({
    userId: {
      username: '',
      address: '',
      phone: '',
      _id: '',
    },
    category: '',
    StartingDate: '',
    EndingDate: '',
    eventType: '',
    vendorId: '',
    auditoriumId: '',
    dishesId: '',
    advanceAmount: 10000,
  });

  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  const checkDateAvailability = async (vendorId: string, startingDate: string, endingDate: string): Promise<boolean> => {
    if (!vendorId || !startingDate || !endingDate) {
      console.error("Missing required parameters: vendorId, startingDate, or endingDate.");
      return false;
    }

    try {
      const response = await getSlotsByWorkerAPI(vendorId);
      console.log(response);
      console.log(typeof response);

      if (!response || !Array.isArray(response.data)) {
        console.error('Invalid response from date availability API.');
        return false;
      }

      const isDateRangeAvailable = response.data.some((slot: { date: string; isAvailable: boolean; startDate: string; endDate: string }) => {
        const slotStartDate = new Date(slot.startDate); 
        const slotEndDate = new Date(slot.endDate); 
        const startDate = new Date(startingDate);
        const endDate = new Date(endingDate);

        const isOverlapping =
          (startDate >= slotStartDate && startDate <= slotEndDate) ||
          (endDate >= slotStartDate && endDate <= slotEndDate) ||
          (startDate <= slotStartDate && endDate >= slotEndDate);

        return isOverlapping && slot.isAvailable;
      });

      if (isDateRangeAvailable) {
        console.log("Dates are available.");
        return true;
      } else {
        console.error("Selected date is already taken.");
        return false;
      }
    } catch (error) {
      console.error('Error fetching slot details:', error);
      return false;
    }
  };




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

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6">Checkout</h1>
      <p className="text-center mb-10 text-lg text-gray-600">Confirm your event details and proceed with the payment</p>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-10">
        {/* Left: Price Details */}
        <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Price Details</h2>

          <div className="space-y-4">
            {Object.entries(bookingDetails.userId).map(([key, value]) => value && (
              <p key={key} className="text-lg text-gray-700">
                <span className="font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {value}
              </p>
            ))}
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
        {/* <div className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Enable Payment</h2>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="paymentToggle"
              checked={isPaymentEnabled}
              onChange={async () => {
                if (bookingDetails?.StartingDate && bookingDetails?.EndingDate && bookingDetails?.vendorId) {
                  const isDateAvailable = await checkDateAvailability(
                    bookingDetails.vendorId,
                    bookingDetails.StartingDate,
                    bookingDetails.EndingDate
                  );
                  if (isDateAvailable) {
                    setIsPaymentEnabled(!isPaymentEnabled);
                  }
                } else {
                  toast.error("Booking details are incomplete.");
                }
              }}

              className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="paymentToggle" className="text-lg text-gray-700">
              Enable Payment
            </label>
          </div>

          {isPaymentEnabled && (
            <div className="mt-4">
              <PayUComponent BookedData={bookingDetails} />
            </div>
          )}
        </div> */}

        <div className="w-full lg:w-1/3 bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Enable Payment</h2>

          {/* Toggle for Payment Method */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="paymentToggle"
              checked={isPaymentEnabled}
              onChange={() => setIsPaymentEnabled(!isPaymentEnabled)}
              className="mr-2"
            />
            <label htmlFor="paymentToggle" className="text-lg text-gray-700">
              Enable Payment
            </label>
          </div>

          {/* Conditionally render the PayUComponent */}
          {isPaymentEnabled && (
            <PayUComponent BookedData={bookingDetails} />
          )}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
