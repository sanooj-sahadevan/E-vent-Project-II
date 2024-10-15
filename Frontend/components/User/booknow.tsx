'use client';
import React, { useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import img from '@/public/7.jpg.jpg';
import AvailabilityModal from "./checkAvailability";

const Booknow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vendorId = searchParams.get("vendorId") || localStorage.getItem("vendorId");
  const auditoriumId = searchParams.get("auditoriumId") || localStorage.getItem("auditoriumId");
  const dishesId = searchParams.get("dishesId") || localStorage.getItem("dishesId");
  const profileImage = searchParams.get("profileImage") || localStorage.getItem("profileImage") || "/default-vendor.jpg";
  const vendorName = searchParams.get("vendorname") || localStorage.getItem("vendorName") || "Vendor Name";
  const email = searchParams.get("email") || localStorage.getItem("email") || "vendor@example.com";

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Format date function to return a string in 'YYYY-MM-DD' format
  const formatDate = (dateString: string | null): any => {
    if (!dateString) return null; // Return null if the date is not provided
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Get the date in 'YYYY-MM-DD' format
  };

  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  console.log(formattedStartDate, 'formatted start date');
  console.log(formattedEndDate, 'formatted end date');

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userId = user._id;

  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    if (vendorId) localStorage.setItem("vendorId", vendorId);
    if (auditoriumId) localStorage.setItem("auditoriumId", auditoriumId);
    if (dishesId) localStorage.setItem("dishesId", dishesId);
    if (profileImage) localStorage.setItem("profileImage", profileImage);
    if (vendorName) localStorage.setItem("vendorName", vendorName);
    if (email) localStorage.setItem("email", email);
  }, [vendorId, auditoriumId, dishesId, profileImage, vendorName, email]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      EndingDate:formattedStartDate,
      StartingDate: formattedEndDate,
      category: event.currentTarget.category.value,
      eventType: event.currentTarget.eventType.value,
      occupancy: event.currentTarget.people.value,
      vendorId: vendorId || "",
      auditoriumId: auditoriumId || "",
      dishesId: dishesId || "",
      userId: userId
    };

    try {
      const queryString = new URLSearchParams(formData).toString();
      router.push(`/checkout?${queryString}`);
    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  const handleCheckAvailability = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mt-[100px] items-center bg-gray-100 p-8">
      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full flex">
        {/* Form Section */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6">BOOK AN EVENT</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Date Input */}
            <div>
              {(!formattedStartDate && !formattedEndDate) ? (
                <><p onClick={handleCheckAvailability}
                >Selet date</p></>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                    Date (Start: {formattedStartDate}, End: {formattedEndDate})
                  </label>
                  {/* <input
                    type="date"
                    id="date"
                    name="date"
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder={formattedStartDate}
                    required
                  /> */}
                </>
              )}
            </div>

            {/* Event Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                Event Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              >
                <option value="">Select</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="silver">Silver</option>
              </select>
            </div>

            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="eventType">
                Event Type
              </label>
              <input
                type="text"
                id="eventType"
                name="eventType"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Total amount of people */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="people">
                Total amount of people
              </label>
              <input
                type="number"
                id="people"
                name="people"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Select Dishes Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="dishes">
                Add Dishes
              </label>
              <button
                type="button"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer flex justify-center items-center"
                onClick={() => vendorId && router.push(`/dishesList?vendorId=${vendorId}`)}
              >
                <span className="text-2xl font-bold">+</span>
              </button>
            </div>

            {/* Select Auditorium Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="auditorium">
                Add Auditorium
              </label>
              <button
                type="button"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer flex justify-center items-center"
                onClick={() => vendorId && router.push(`/auditoriumList?vendorId=${vendorId}`)}
              >
                <span className="text-2xl font-bold">+</span>
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition"
              >
                Book Now
              </button>
            </div>
          </form>
        </div>

        {/* Image Section */}
        <div className="w-1/2 relative">
          <Image src={img} alt="Wedding event" fill className="rounded-lg object-cover" />
        </div>
      </div>
      <AvailabilityModal open={isModalOpen} onClose={closeModal} vendorId={vendorId!} />
    </div>
  );
};

export default Booknow;
