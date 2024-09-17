/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import { allVendorAPI } from "@/services/userApi";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Vendor {
    _id: string; // Ensure this is a string to match the MongoDB ObjectId type
    image: string | undefined;
    vendorname: string;
    state: string;
    rating: number;
}

const VendorsPage: React.FC = () => {
    const router = useRouter();
    const [vendor, setVendor] = useState<Vendor[]>([]);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const response = await allVendorAPI();
                console.log("API Response:", response);

                setVendor(response);
            } catch (error) {
                console.error("Failed to fetch vendors:", error);
            }
        };

        fetchVendor();
    }, []);

    return (
        <div className="container mx-auto px-8 py-8 bg-white">
            {/* Filter Section */}
            <div className="my-8">
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
            </div>

            {/* Vendor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vendor.map((vendor, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <img
                            src={vendor.image}
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
                ))}
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
