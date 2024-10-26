'use client';
import React, { Suspense, useEffect, useState } from "react";
import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import img from '@/public/7.jpg.jpg';
import AvailabilityModal from "./checkAvailability";

const Booknow: React.FC = () => {
  const router = useRouter();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [auditoriumId, setAuditoriumId] = useState<string | null>(null);
  const [dishesId, setDishesId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/default-vendor.jpg");
  const [vendorName, setVendorName] = useState<string>("Vendor Name");
  const [email, setEmail] = useState<string>("vendor@example.com");

  const [formattedStartDate, setFormattedStartDate] = useState<string | null>(null);
  const [formattedEndDate, setFormattedEndDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    const vendorIdParam = searchParams.get("vendorId") || localStorage.getItem("vendorId");
    const auditoriumIdParam = searchParams.get("auditoriumId") || localStorage.getItem("auditoriumId");
    const dishesIdParam = searchParams.get("dishesId") || localStorage.getItem("dishesId");
    const profileImageParam = searchParams.get("profileImage") || localStorage.getItem("profileImage") || "/default-vendor.jpg";
    const vendorNameParam = searchParams.get("vendorname") || localStorage.getItem("vendorName") || "Vendor Name";
    const emailParam = searchParams.get("email") || localStorage.getItem("email") || "vendor@example.com";

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const formatDate = (dateString: string | null): any => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    setVendorId(vendorIdParam);
    setAuditoriumId(auditoriumIdParam);
    setDishesId(dishesIdParam);
    setProfileImage(profileImageParam);
    setVendorName(vendorNameParam);
    setEmail(emailParam);
    setFormattedStartDate(formatDate(startDate));
    setFormattedEndDate(formatDate(endDate));
  }, [searchParams]);

  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = {
  //     EndingDate: formattedStartDate,
  //     StartingDate: formattedEndDate,
  //     category: event.currentTarget.category.value,
  //     eventType: event.currentTarget.eventType.value,
  //     occupancy: event.currentTarget.people.value,
  //     vendorId: vendorId || "",
  //     auditoriumId: auditoriumId || "",
  //     dishesId: dishesId || "",
  //     userId: JSON.parse(localStorage.getItem("user") || '{}')._id
  //   };

  //   try {
  //     const queryString = new URLSearchParams(formData).toString();
  //     router.push(`/checkout?${queryString}`);
  //   } catch (error) {
  //     console.error('Error booking event:', error);
  //   }
  // };



  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = {
      EndingDate: formattedStartDate || "",
      StartingDate: formattedEndDate || "",
      category: event.currentTarget.category.value,
      eventType: event.currentTarget.eventType.value,
      occupancy: event.currentTarget.people.value.toString(),
      vendorId: vendorId || "",
      auditoriumId: auditoriumId || "",
      dishesId: dishesId || "",
      userId: JSON.parse(localStorage.getItem("user") || '{}')._id || ""
    };

    try {
      const queryString = new URLSearchParams(formData as Record<string, string>).toString();
      router.push(`/checkout?${queryString}`);
    } catch (error) {
      console.error('Error booking event:', error);
    }
  };

  const handleCheckAvailability = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="min-h-screen flex flex-col justify-center mt-[100px] items-center bg-gray-100 p-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-4xl w-full flex">
          <div className="w-1/2 p-8">
            <h2 className="text-2xl font-semibold mb-6">BOOK AN EVENT</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                {(!formattedStartDate && !formattedEndDate) ? (
                  <p onClick={handleCheckAvailability}>Select date</p>
                ) : (
                  <label className="block text-sm font-medium text-gray-700">
                    Date (Start: {formattedStartDate}, End: {formattedEndDate})
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                  Event Category
                </label>
                <select id="category" name="category" className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                  <option value="">Select</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                  <option value="silver">Silver</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="eventType">
                  Event Type
                </label>
                <input type="text" id="eventType" name="eventType" className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="people">
                  Total amount of people
                </label>
                <input type="number" id="people" name="people" className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="dishes">
                  Add Dishes
                </label>
                <button type="button" className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer flex justify-center items-center" onClick={() => vendorId && router.push(`/dishesList?vendorId=${vendorId}`)}>
                  <span className="text-2xl font-bold">+</span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="auditorium">
                  Add Auditorium
                </label>
                <button type="button" className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 cursor-pointer flex justify-center items-center" onClick={() => vendorId && router.push(`/auditoriumList?vendorId=${vendorId}`)}>
                  <span className="text-2xl font-bold">+</span>
                </button>
              </div>
              <div>
                <button type="submit" className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-700 transition">Book Now</button>
              </div>
            </form>
          </div>
          <div className="w-1/2 relative">
            <Image src={img} alt="Wedding event" fill className="rounded-lg object-cover" />
          </div>
        </div>
        <AvailabilityModal open={isModalOpen} onClose={closeModal} vendorId={vendorId || ""} />
      </div>
    </Suspense>
  );
};

export default Booknow;
