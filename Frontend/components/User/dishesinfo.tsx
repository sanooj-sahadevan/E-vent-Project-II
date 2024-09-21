/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchauditorium } from "@/services/vendorAPI";

interface Auditorium {
  images?: string;
  auditoriumName: string;
  rating: number;
  category?: string;
  description?: string;
  menu: string;
  types: string;
  price: number;
}

const FoodItemPage: React.FC = () => {
  const searchParams = useSearchParams();
  const auditoriumId = searchParams.get("auditoriumId");

  const [auditoriumData, setAuditoriumData] = useState<Auditorium | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuditoriumDetails = async () => {
      if (auditoriumId) {
        try {
          const response = await fetchauditorium(auditoriumId);
          console.log(response);

          if (response && response.data) {
            setAuditoriumData(response.data);
          } else {
            toast.error("Auditorium details not found.");
          }
        } catch (error) {
          toast.error("Failed to load auditorium details.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAuditoriumDetails();
  }, [auditoriumId]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    console.log(checked);
    // You can handle the checkbox state here, such as adding an item ID reference
  };

  if (loading) {
    return <p>Loading...</p>; // Optional: Add a loading spinner or placeholder
  }

  if (!auditoriumData) {
    return <p>No auditorium data available.</p>; // Handle cases where no auditorium data is available
  }

  const {
    images = "/placeholder.png",
    auditoriumName,
    rating,
    category,
    description,
    menu,
    types,
    price,
  } = auditoriumData;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-center text-2xl font-bold mb-8">Food Items</h1>

      {/* Top Food Image */}
      <div className="relative w-full h-[300px] mb-8">
        <img
          src={images} // Replace with dynamic image URL
          alt={auditoriumName}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Menu Card */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Menu: {menu}</h2>
          <p className="text-sm text-gray-600 mb-6">
            {description || 'No description available.'}
          </p>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              onChange={handleCheckboxChange} // Checkbox handler
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Add Item</span>
          </label>
        </div>

        {/* Auditorium Description */}
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">{auditoriumName}</h2>
          <div className="text-sm text-gray-500 mb-4 flex items-center">
            <span className="inline-block mr-2">📍</span>
            <span>{category || 'No category available'}</span>
          </div>
          <div className="text-sm text-gray-600 mb-4">
            <strong>Type: </strong> {types}
          </div>
          <div className="flex items-center mb-4">
            <span className="text-red-500 text-lg">★</span>
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
          <p className="text-sm text-gray-600">
            <strong>Price: </strong> ${price}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodItemPage;
