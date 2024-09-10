/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { allVendorAPI } from "@/services/userApi";


interface Vendor {
    images: string[];
    name: string;
    location: string;
    rating: number;
   
}


// const vendors: Vendor[] = [
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     { name: 'Lakme', location: 'Palakkad', rating: 4.5, image: '/image-url' },
//     // Add more vendors as needed
// ];

const VendorsPage: React.FC = () => {


    const [vendor, setVendor] = useState<Vendor[]>([]);
//   const [formattedDates, setFormattedDates] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await allVendorAPI(); // Fetch trips from API
        console.log("API Response:", response); // Log API response

        setVendor(response); // Update state with fetched trips
        // setLoading(false);
      } catch (error) {
        // setLoading(false);
        console.error("Failed to fetch trips:", error);
      }
    };

    fetchVendor(); // Call fetch function when component mounts
  }, []);
    return (
        <div className="container mx-auto px-8 py-8 bg-white">
            {/* Filter Section */}
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

            {/* Vendor Cards */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {vendor.map((vendor, index) => (
                    <div key={index} className="bg-white shadow-md rounded-lg p-4">
                        <img
                            src={vendor.image}
                            alt={vendor.name}
                            className="w-full h-40 object-cover rounded-t-md"
                        />
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">{vendor.name}</h3>
                            <p className="text-sm text-gray-600">{vendor.location}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-red-500 text-lg">★</span>
                                <span className="ml-1 text-sm text-gray-600">{vendor.rating}</span>
                            </div>
                            <button className="mt-4 w-full bg-black text-white py-2 rounded-md">
                                Find Vendors
                            </button>
                        </div>
                    </div>
                ))}
            </div> */}

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
