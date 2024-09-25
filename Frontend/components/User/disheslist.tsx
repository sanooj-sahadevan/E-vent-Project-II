/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import { FetchDishes } from "@/services/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Dishes {
    _id: string;
    images: string | undefined;
    dishesName: string;
    state: string;
    rating: number;
    price: number;
}

const DishesPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");

    const [dishes, setDishes] = useState<Dishes[]>([]); // Initialize as an empty array

    useEffect(() => {
        const fetchDishes = async () => {
            if (!vendorId) {
                toast.error("Vendor ID is missing. Please try again.");
                return; // Exit if vendorId is null
            }

            try {
                const response = await FetchDishes(vendorId);
                console.log("API Response:", response);
                if (Array.isArray(response)) {
                    setDishes(response);
                } else {
                    console.error("Unexpected response format:", response);
                    toast.error("Failed to load Dishes. Please try again later.");
                }
            } catch (error) {
                console.error("Failed to fetch Dishes:", error);
                toast.error("Error fetching dishes. Redirecting to login.");
                router.push('/login');
            }
        };

        fetchDishes();
    }, [router, vendorId]);  // Added vendorId as a dependency









    return (
        <div className="container mx-auto px-8 py-8 bg-white m-[100px] mt-[100px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dishes.length > 0 ? (
                    dishes.map((dish) => (
                        <div key={dish._id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={dish.images || "/placeholder.png"}  // Fixed fallback image logic
                                alt={dish.dishesName}
                                className="w-full h-40 object-cover rounded-t-md"
                            />
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">{dish.dishesName}</h3>
                                <p className="text-sm text-gray-600">Price: ${dish.price}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-red-500 text-lg">★</span>
                                    <span className="ml-1 text-sm text-gray-600">{dish.state}</span>
                                </div>
                                <button
                                    onClick={() => router.push(`/dishesinfo?dishesId=${dish._id}&vendorId=${vendorId}`)}  // Pass vendorId along with dishesId
                                    className="mt-4 w-full bg-black text-white py-2 rounded-md"
                                >
                                    Find Dish
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No dishes found.</p> // Fallback when no dishes are available
                )}
            </div>

            {/* Pagination - Dummy button for now */}
            <div className="flex justify-center mt-8">
                <button className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white rounded-full">
                    1
                </button>
            </div>

            <ToastContainer />
        </div>
    );
};

export default DishesPage;
