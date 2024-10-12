/* eslint-disable @next/next/no-img-element */
'use client';

import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchvendor, fetchReview } from '@/services/userApi';

interface Review {
    userId: any;
    stars: number;
    reviews: ReactNode;
    name: string;
    rating: number;
    review: string; // Changed from String to string (use lowercase)
}

interface Vendor {
    profileImage?: string; // Use optional chaining
    vendorname: string;
    email: string;
    state: string;
    reviews: Review[]; // Changed to an array of Review objects
    photos: string[]; // Assuming photos are strings (URLs)
}

const VendorsPage: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vendorId = searchParams.get("vendorId");

    const [review, setReview] = useState<Review[]>([]); // Initialize as an empty array
    const [vendorData, setVendorData] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [chatId, setChatId] = useState<string | null>(null);

    // Get user ID from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem('user');
            const parsedUser = user ? JSON.parse(user) : null;
            setUserId(parsedUser?._id || null);
        }
    }, []);

    // Fetch vendor details
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



    // Fetch vendor reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (vendorId && userId) {
                try {
                    const response = await fetchReview(vendorId, userId);
                    console.log(response);

                    if (response && response.review) {
                        setReview(response.review.review);
                    } else {
                        toast.error("No reviews found.");
                    }
                } catch (error) {
                    toast.error("Failed to load reviews.");
                    console.error(error);
                } finally {
                    setLoadingReviews(false);
                }
            } else {
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [vendorId, userId]);
    console.log(review, '999999999999999999999999');

    if (loading || loadingReviews) {
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
                <div className="relative flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <img
                        src={vendorData.profileImage || "/default-vendor.jpg"}
                        alt="Vendor Image"
                        className="rounded-full w-24 h-24 object-cover border-4 border-white"
                    />
                    <div className="text-center md:text-left">
                        <h1 className="text-2xl font-semibold">{vendorData.vendorname}</h1>
                        <p className="text-sm text-gray-600">{vendorData.email}</p>
                    </div>
                </div>

                <div className="relative flex items-center justify-center md:justify-start mt-4">
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

                <div className="absolute right-6 top-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <button
                        onClick={() => router.push(`/booknow?vendorId=${vendorId}`)}
                        className="px-4 py-2 bg-buttonBg text-white rounded"
                    >
                        Book Now
                    </button>
                    <button
                        onClick={() => chatId && router.push(`/chat?vendorId=${vendorId}&chatId=${chatId}`)}
                        className={`px-4 py-2 bg-buttonBg text-white rounded ${!chatId ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!chatId}
                    >
                        Chat With Us
                    </button>
                    <button className="px-4 py-2 bg-buttonBg text-white rounded">Check Availability</button>
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-[70px] mt-[71px]">
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                        {vendorData.photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo || "/default-photo.jpg"}
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
            <div className="mb-[70px] mt-[71px] text-center">
                <h2 className="text-xl font-semibold">Reviews</h2>
                {Array.isArray(review) && review.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {review.map((reviewItem, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-white border border-gray-300 rounded-md shadow-md flex justify-between items-start"
                                >
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                          
                                        </span>
                                        <p className="text-gray-800 font-medium">{reviewItem.userId.username}</p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <span className="text-yellow-500">
                                            {"★".repeat(Math.round(reviewItem.stars))}
                                        </span>
                                        <span className="text-gray-500">{reviewItem.stars}</span>
                                    </div>
                                    <p className="mt-2 text-gray-700">{reviewItem.reviews}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center mt-6">
                            <button className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105">
                                VIEW MORE REVIEWS
                            </button>
                           
                        </div>
                    </>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No reviews available.</p>
                )}
            </div>

        </div>
    );
};

export default VendorsPage;
