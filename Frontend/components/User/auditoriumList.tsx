/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from "react";
import { FetchAuditorium } from "@/services/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Auditorium {
    _id: string;
    images?: string;  // Assuming images is a string; update if it's an array
    auditoriumName: string;
    types: string;
    rating: number;
    price: number;
}

const AuditoriumPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");  // Get vendorId from URL parameters
    const [auditorium, setAuditorium] = useState<Auditorium[]>([]); // Initialize as an empty array

    useEffect(() => {
        const fetchAuditorium = async () => {
            if (!vendorId) {
                toast.error("Vendor ID is missing. Please try again.");
                return; // Exit if vendorId is null
            }
    
            try {
                const response = await FetchAuditorium(vendorId); // Now it's safe to pass vendorId
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
                // router.push('/login');  // Ensure correct redirection
            }
        };
    
        // Pass vendorId to the fetchAuditorium function
        fetchAuditorium();
    }, [vendorId, router]);
    
    return (
        <div className="container mx-auto px-8 py-8 bg-white">
            {/* Auditorium Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {auditorium.length > 0 ? (
                    auditorium.map((aud) => (
                        <div key={aud._id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={aud.images || "/placeholder.png"}  // Fixed fallback image logic
                                alt={aud.auditoriumName}
                                className="w-full h-40 object-cover rounded-t-md"
                            />
                            <div className="mt-4">
                                <h3 className="text-lg font-semibold">{aud.auditoriumName}</h3>
                                <p className="text-sm text-gray-600">Price: ${aud.price}</p>
                                <div className="flex items-center mt-2">
                                    <span className="text-red-500 text-lg">★</span>
                                    <span className="ml-1 text-sm text-gray-600">{aud.types}</span>
                                </div>
                                <button
                                    onClick={() => router.push(`/auditoriumInfo?auditoriumId=${aud._id,vendorId}&vendorId=${vendorId}`)}  
                                    className="mt-4 w-full bg-black text-white py-2 rounded-md"
                                >
                                    Find auditorium
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No auditorium found.</p> // Fallback when no auditoriums are available
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
