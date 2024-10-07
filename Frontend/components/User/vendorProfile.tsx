/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchvendor } from '@/services/userApi';

interface Vendor {
    profileImage: string | undefined;
    vendorname: string;
    email: string;
    state: string;
    rating: number;
    reviews: Array<{ name: string; review: string; rating: number }>;
    photos: [];
}

const VendorsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");

    const [vendorData, setVendorData] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [chatId, setChatId] = useState<string | null>(null); 

    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setUserId(parsedUser?._id || null);
        }
    }, []);

    useEffect(() => {
        const fetchVendorDetails = async () => {
            if (vendorId && userId) {
                try {
                    const response = await fetchvendor(vendorId, userId);

                    if (response) {
                        const { vendor, chatId } = response;
                        setVendorData(vendor);
                        setChatId(chatId); 
                    } else {
                        toast.error("Vendor details not found.");
                    }
                } catch (error) {
                    toast.error("Failed to load vendor details.");
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false); 
            }
        };

        fetchVendorDetails();
    }, [vendorId, userId]);    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (!vendorData) {
        return <p>No vendor data available.</p>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6 mt-12">
            {/* Header */}
            <div className="relative p-6 rounded-lg mb-[70px] mt-[71px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('/vendor-bg.jpg')` }}
                ></div>
                <div className="relative flex items-center space-x-6">
                    <img
                        src={vendorData.profileImage || "/default-vendor.jpg"}
                        alt="Vendor Image"
                        className="rounded-full w-24 h-24 object-cover border-4 border-white"
                    />
                    <div>
                        <h1 className="text-2xl font-semibold">{vendorData.vendorname}</h1>
                        <p className="text-sm text-gray-600">{vendorData.email}</p>
                    </div>
                </div>

                <div className="relative flex items-center mt-4">
                    {/* Location symbol and state */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 11c1.656 0 3-1.343 3-3s-1.344-3-3-3-3 1.343-3 3 1.344 3 3 3zm0 0c-3.313 0-6 2.687-6 6 0 2.875 4.438 6.375 6 6.375S18 19.875 18 17c0-3.313-2.687-6-6-6z"
                        />
                    </svg>
                    <p className="text-gray-700">{vendorData.state}</p>
                </div>

                <div className="absolute right-6 top-6 flex space-x-4">
                    <button
                        onClick={() => router.push(`/booknow?vendorId=${vendorId}`)}
                        className="px-4 py-2 bg-buttonBg text-white rounded"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={() => chatId && router.push(`/chat?vendorId=${vendorId}&chatId=${chatId}`)} // Include chatId in the route
                        className="px-4 py-2 bg-buttonBg text-white rounded"
                    >
                        Chat With Us
                    </button>
                    <button className="px-4 py-2 bg-buttonBg text-white rounded">Check Availability</button>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-[70px] mt-[71px]">
                <div className="bg-gray-100 p-4 rounded-md shadow">
                    <h3 className="text-lg font-semibold">Platinum</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eros non urna fermentum.</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-md shadow">
                    <h3 className="text-lg font-semibold">Gold</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eros non urna fermentum.</p>
                </div>
                <div className="bg-gray-200 p-4 rounded-md shadow">
                    <h3 className="text-lg font-semibold">Silver</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam volutpat eros non urna fermentum.</p>
                </div>
            </div>

            {/* Photos */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold">Photos</h2>
                {Array.isArray(vendorData.photos) && vendorData.photos.length > 0 ? (
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {vendorData.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Vendor Photo ${index + 1}`}
                                className="object-cover w-full h-40 rounded-md"
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No photos available.</p>
                )}
            </div>

            {/* Reviews */}
            <div className="mb-[70px] mt-[71px]">
                <h2 className="text-xl font-semibold">Reviews</h2>
                {Array.isArray(vendorData.reviews) && vendorData.reviews.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {vendorData.reviews.map((review, index) => (
                                <div key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
                                    <div className="flex justify-between">
                                        <p>{review.name}</p>
                                        <div className="flex items-center space-x-1">
                                            <span className="text-yellow-500">
                                                {"★".repeat(Math.round(review.rating))}
                                            </span>
                                            <span>{review.rating}</span>
                                        </div>
                                    </div>
                                    <p>{review.review}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-center space-x-4">
                            <button className="px-4 py-2 bg-buttonBg text-white rounded">
                                View All
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500">No reviews available.</p>
                )}
            </div>
        </div>
    );
};

export default VendorsPage;
