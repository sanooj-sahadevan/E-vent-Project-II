/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchauditorium } from "@/services/userApi";
import Spinner from "../skeletons/spinner";

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const auditoriumId = searchParams.get("auditoriumId");
  const vendorId = searchParams.get("vendorId");

  const [auditoriumData, setAuditoriumData] = useState<Auditorium | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuditoriumDetails = async () => {
      if (auditoriumId) {
        try {
          const response = await fetchauditorium(auditoriumId);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  if (!auditoriumData) {
    return <p>No auditorium data available.</p>;
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
      <div className="relative w-full h-[300px] mb-8">
        <img
          src={images}
          alt={auditoriumName}
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Menu: {menu}</h2>
          <p className="text-sm text-gray-600 mb-6">
            {description || 'No description available.'}
          </p>
          <button
            onClick={() => router.push(`/booknow?auditoriumId=${auditoriumId}&vendorId=${vendorId}`)}
            className="mt-4 w-full bg-black text-white py-2 rounded-md"
          >
            Add Item
          </button>
        </div>
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

export default function FoodItemPageWithSuspense() {
  return (
    <Suspense fallback={<Spinner size="xl" color="gray" />}>
      <FoodItemPage />
    </Suspense>
  );
}
