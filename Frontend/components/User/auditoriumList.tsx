/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import { allAuditoriumAPI } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Auditorium {
    _id: string;
    images?: string;  // Changed to array of strings
    auditoriumName: string;
    types: string;
    rating: number;
    price: number;
}

const AuditoriumPage: React.FC = () => {
    const router = useRouter();
    const [auditorium, setAuditorium] = useState<Auditorium[]>([]); // Initialize as an empty array

    useEffect(() => {
        const fetchAuditorium = async () => {
            try {
                const response = await allAuditoriumAPI();
                console.log("API Response:", response);
                if (Array.isArray(response)) {
                    setAuditorium(response);
                } else {
                    console.error("Unexpected response format:", response);
                    toast.error("Failed to load Auditorium. Please try again later.");
                }
            } catch (error) {
                console.error("Failed to fetch Auditorium:", error);
                toast.error("Error fetching Auditorium. Redirecting to login.");
                router.push('/login');  // Ensure correct redirection
            }
        };

        fetchAuditorium();
    }, [router]);

    return (
        <div className="container mx-auto px-8 py-8 bg-white">
            {/* Filter Section - Uncomment and implement as needed */}
            {/* <div className="my-8">
                <div className="flex justify-end space-x-4">
                    <div>Filter by</div>
                    <select className="border rounded px-2 py-1">
                        <option>Category</option>
                        <option>Category 1</option>
                        <option>Category 2</option>
                    </select>
                    <select className="border rounded px-2 py-1">
                        <option>Location</option>
                        <option>Location 1</option>
                        <option>Location 2</option>
                    </select>
                    <select className="border rounded px-2 py-1">
                        <option>Type</option>
                        <option>Type 1</option>
                        <option>Type 2</option>
                    </select>
                </div>
            </div> */}

            {/* Auditorium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {auditorium.length > 0 ? (
                    auditorium.map((auditorium) => (
                        <div key={auditorium._id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={auditorium.images || "/placeholder.png"}  // Fixed fallback image logic
                                alt={auditorium.auditoriumName}
                                className="w-full h-40 object-cover rounded-t-md"
                            />
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">{auditorium.auditoriumName}</h3>
                                <p className="text-sm text-gray-600">Price: ${auditorium.price}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-red-500 text-lg">★</span>
                                    <span className="ml-1 text-sm text-gray-600">{auditorium.types}</span>
                                </div>
                                <button
                                    onClick={() => router.push(`/auditoriumInfo?auditoriumId=${auditorium._id}`)}  // Ensure correct ID is passed
                                    className="mt-4 w-full bg-black text-white py-2 rounded-md"
                                >
                                    Find auditorium
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No auditorium found.</p> // Fallback when no auditorium are available
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
}

export default AuditoriumPage;
