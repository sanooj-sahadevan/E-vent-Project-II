/* eslint-disable @next/next/no-img-element */
'use client';

import React from "react";
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import img from '@/public/7.jpg.jpg';

const Booknow: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const auditoriumId = searchParams.get("auditoriumId");
  const dishesId = searchParams.get("dishesId");
  const profileImage = searchParams.get("profileImage") || "/default-vendor.jpg";
  const vendorName = searchParams.get("vendorname") || "Vendor Name";
  const email = searchParams.get("email") || "vendor@example.com";

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Collecting form data, including auditoriumId
    const formData = {
      date: event.currentTarget.date.value,
      category: event.currentTarget.category.value,
      eventType: event.currentTarget.eventType.value,
      people: event.currentTarget.people.value,
      vendorId: vendorId || "",
      auditoriumId: auditoriumId || "",
    };

    try {
      // Convert formData to query parameters
      const queryString = new URLSearchParams(formData).toString();
      // Push to /checkout with all form data in query params
      router.push(`/checkout?${queryString}`);

    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center mt-[100px] items-center bg-gray-100 p-8">
      {/* <div className="relative p-6 rounded-lg mb-8 mt-4 shadow-lg w-full max-w-3xl">
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url('/vendor-bg.jpg')` }}
        ></div>
        <div className="relative flex items-center space-x-6 z-10">
          <img
            src={profileImage}
            alt="Vendor Image"
            className="rounded-full w-24 h-24 object-cover border-4 border-white"
          />
          <div>
            <h1 className="text-2xl font-semibold text-white">{vendorName}</h1>
            <p className="text-sm text-gray-200">{email}</p>
          </div>
        </div>
        <div className="absolute right-6 top-6 flex space-x-4 z-10">
          <button
            onClick={() => router.push(`/booknow?vendorId=${vendorId}`)} 
            className="px-4 py-2 bg-buttonBg text-white rounded hover:bg-buttonBgHover transition"
          >
            Book Now
          </button>
          <button className="px-4 py-2 bg-buttonBg text-white rounded hover:bg-buttonBgHover transition">Chat With Us</button>
          <button className="px-4 py-2 bg-buttonBg text-white rounded hover:bg-buttonBgHover transition">Check Availability</button>
        </div>
      </div> */}

      <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full flex">
        {/* Form Section */}
        <div className="w-1/2 p-8">
          <h2 className="text-2xl font-semibold mb-6">BOOK AN EVENT</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Date Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
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
              <input
                type="button"
                value="Select Dishes"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                onClick={() => vendorId && router.push(`/dishesList?vendorId=${vendorId}`)}
              />
            </div>

            {/* Select Auditorium Button */}
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="auditorium">
                Add Auditorium
              </label>
              <input
                type="button"
                value="Select Auditorium"
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer"
                onClick={() => vendorId && router.push(`/auditoriumList?vendorId=${vendorId}`)}
              />
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
          <Image src={img} alt="Wedding event" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default Booknow;
