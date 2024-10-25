/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchdishes } from "@/services/userApi";
import Spinner from "../skeletons/spinner";

interface Dishes {
  images?: string;
  dishesName: string;
  rating: number;
  category?: string;
  description?: string;
  menu: string;
  types: string;
  price: number;
}

const FoodItemPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dishesId = searchParams.get("dishesId");
  const vendorId = searchParams.get("vendorId");


  const [dishesData, setDishesData] = useState<Dishes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDishesDetails = async () => {
      if (dishesId) {
        try {
          const response = await fetchdishes(dishesId);
          console.log(response, 'okoko');

          if (response && response.data) {
            setDishesData(response.data);
          } else {
            toast.error("Dishes details not found.");
          }
        } catch (error) {
          toast.error("Failed to load dishes details.");
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDishesDetails();
  }, [dishesId]);

  const addItem = () => {
    if (dishesId) {
      toast.success("Item added to the cart.");
    } else {
      toast.error("No valid item to add.");
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    console.log(checked);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  if (!dishesData) {
    return <p>No dishes data available.</p>;
  }

  const {
    images = "/placeholder.png",
    dishesName,
    rating,
    category,
    description,
    menu,
    types,
    price,
  } = dishesData;

  return (



    <div className="container mx-auto px-10 py-10 shadow-lg"> {/* Added shadow to the container */}
      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">Food Item Details</h1>

      {/* Top Food Image */}
      <div className="relative w-full h-[300px] mb-6 shadow-lg"> {/* Added shadow */}
        <img
          src={images}
          alt={dishesName}
          className="w-full h-full object-cover rounded-xl shadow-lg"
        />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Menu Card */}
        <div className="bg-white shadow-lg rounded-lg p-4"> {/* Adjusted shadow */}
          <h2 className="text-2xl font-semibold mb-4">Menu: {menu}</h2>
          <p className="text-gray-600 mb-4">
            {description || 'No description available.'}
          </p>
          <label className="inline-flex items-center mb-4">
            <input
              type="checkbox"
              className="form-checkbox text-indigo-600"
              onChange={handleCheckboxChange}
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Add Item</span>
          </label>
        </div>

        {/* Dishes Description */}
        <div className="bg-white shadow-lg rounded-lg p-4"> {/* Adjusted shadow */}
          <h2 className="text-2xl font-semibold mb-2">{dishesName}</h2>
          <div className="text-gray-500 mb-2 flex items-center">
            <span className="inline-block mr-2">📍</span>
            <span>{category || 'No category available'}</span>
          </div>
          <div className="text-gray-600 mb-2">
            <strong>Type: </strong> {types}
          </div>
          <div className="flex items-center mb-2">
            <span className="text-red-500 text-lg">★</span>
            <span className="ml-1 text-sm text-gray-600">{rating}</span>
          </div>
          <p className="text-gray-600 text-sm">
            <strong>Price: </strong> ${price}
          </p>
        </div>
      </div>

      {/* Add to Cart Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => router.push(`/booknow?dishesId=${dishesId}&vendorId=${vendorId}`)}
          className="w-full md:w-1/3 bg-pink-500 hover:bg-pink-600 text-white py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105"
        >
          Add Item
        </button>
      </div>
    </div>





  );
};

export default FoodItemPage;
