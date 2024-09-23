/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import { allVendorAPI } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Dishes {
    profileImage: string | undefined;
    profileimage: string | undefined;
    _id: string; // Ensure this is a string to match the MongoDB ObjectId type
    image: string | undefined;
    vendorname: string;
    state: string;
    rating: number;
}

const VendorsPage: React.FC = () => {
    const router = useRouter();
    const [vendor, setVendor] = useState<Dishes[]>([]); // Ensure it's initialized as an empty array

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await allVendorAPI();
                console.log("API Response:", response);

                // Ensure the response is an array
                if (Array.isArray(response)) {
                    setVendor(response);
                } else {
                    console.error("Unexpected response format:", response);
                    toast.error("Failed to load vendors. Please try again later.");
                }
            } catch (error) {
                router.push('/login');
                console.error("Failed to fetch vendors:", error);
            }
        };

        fetchVendor();
    }, [router]);

    return (
        <div className="container mx-auto px-40 py-8 bg-white"> {/* Reduced horizontal padding */}
        {/* Filter Section */}
        <div className="my-8">
            <div className="flex justify-end space-x-4 mb-6"> {/* Added margin-bottom */}
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
        </div>
    
        {/* Vendor Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {vendor.length > 0 ? (
                vendor.map((vendor, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <img
                            src={vendor.profileImage || vendor.profileimage || "/placeholder.png"} // Fallback for missing image
                            alt={vendor.vendorname}
                            className="w-full h-40 object-cover rounded-t-md"
                        />
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">{vendor.vendorname}</h3>
                            <p className="text-sm text-gray-600">{vendor.state}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-red-500 text-lg">★</span>
                                <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
                            </div>
                            <button
                                onClick={() => router.push(`/vendorProfile?vendorId=${vendor._id}`)}
                                className="mt-4 w-full bg-black text-white py-2 rounded-md"
                            >
                                Find Vendors
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No vendors found.</p> // Fallback when no vendors are available
            )}
        </div>
    
        {/* Pagination */}
        <div className="flex justify-center mt-8">
            <button className="w-10 h-10 flex items-center justify-center bg-pink-500 text-white rounded-full">
                1
            </button>
        </div>
    </div>
    
    );
};

export default VendorsPage;
