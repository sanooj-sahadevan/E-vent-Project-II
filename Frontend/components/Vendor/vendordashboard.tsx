/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { vendorDetails } from '@/services/vendorAPI'; // Ensure vendorAPI is correctly imported
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define interfaces for data
interface Photo {
    src: string;
    alt: string;
}

interface VendorData {
    vendorname: string;
    email: string;
    state?: string;
    phone: number;
    rating: string;
}

interface Category {
    name: string;
    description: string;
    color: string;
}

interface FoodItem {
    name: string;
    description: string;
    image: string;
}

interface Auditorium {
    name: string;
    description: string;
    image: string;
}

const Home: React.FC = () => {
    const router = useRouter();

    const [photos, setPhotos] = useState<Photo[]>([
        { src: 'https://picsum.photos/200/300', alt: 'Photo 1' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 2' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 3' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 4' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 5' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 6' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 7' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 8' },
        { src: 'https://picsum.photos/200/300', alt: 'Photo 9' },
    ]);

    const [categories, setCategories] = useState<Category[]>([
        { name: 'Category 1', description: 'Description 1', color: 'bg-red-500' },
        { name: 'Category 2', description: 'Description 2', color: 'bg-blue-500' },
        { name: 'Category 3', description: 'Description 3', color: 'bg-green-500' },
    ]);

    const [foodItems, setFoodItems] = useState<FoodItem[]>([
        { name: 'Food Item 1', description: 'Delicious food item', image: 'https://picsum.photos/100' },
        { name: 'Food Item 2', description: 'Yummy dish', image: 'https://picsum.photos/100' },
    ]);

    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([
        { name: 'Auditorium 1', description: 'Spacious auditorium', image: 'https://picsum.photos/100' },
        { name: 'Auditorium 2', description: 'Modern amenities', image: 'https://picsum.photos/100' },
    ]);

    const [showMore, setShowMore] = useState<boolean>(false);
    const [vendorData, setVendorData] = useState<VendorData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleShowMore = () => setShowMore(!showMore);

    useEffect(() => {
        // Fetch vendor profile from local storage on component mount
        const storedUserProfile = localStorage.getItem('vendor');

        if (storedUserProfile) {
            try {
                const vendor = JSON.parse(storedUserProfile);
                setVendorData(vendor);
                setLoading(false);
            } catch (error) {
                setError('Error parsing vendor data from localStorage.');
                setLoading(false);
            }
        } else {
            setError('No vendor data found.');
            setLoading(false);
        }
    }, []); // Run once on mount

    const handleEditProfile = () => {
        if (vendorData) {
            console.log(vendorData);

            // Encode the vendor data
            const query = encodeURIComponent(JSON.stringify(vendorData)); // Properly encode the data for the URL
            router.push(`/vendorEditProfile?query=${query}`);
        }
    };



    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Vendor Card */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <div className="md:flex justify-between p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            {vendorData?.vendorname || 'Loading...'}
                        </h2>
                        <p className="mt-2 text-gray-600">
                            {vendorData?.email || 'N/A'}
                            <br />
                            {vendorData?.phone || 'N/A'}
                            <br />
                            {vendorData?.state || 'N/A'}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">
                            {vendorData?.rating || '4.7'}
                        </div>
                        <a href="#" className="text-sm text-green-600 mt-2">
                            View Reviews
                        </a>
                    </div>
                </div>
                <div className="flex justify-between p-6 bg-gray-50">
                    <button
                        onClick={() => router.push('/vendorBookingDetails')}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600"
                    >
                        Booking Details
                    </button>
                    <button
                        onClick={handleEditProfile}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Rest of the component (Photos, Categories, Food Items, Auditoriums) */}
            {/* Code remains the same */}

            {/* Categories Section */}
            {/* <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Categories</h2>
                    <FaPlus className="text-green-500 cursor-pointer" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <div key={index} className={`${category.color} p-6 rounded-lg shadow-lg`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">{category.name}</h3>
                                <FaEdit className="text-gray-500" />
                            </div>
                            <p className="text-gray-700">{category.description}</p>
                        </div>
                    ))}
                </div>
            </div> */}

            {/* Food Items Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="mr-2">🍲</span> Food Items
                    <a href="/vendorAddDishes">
                        <FaPlus className="text-green-500 cursor-pointer" />
                    </a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto">
                    {foodItems.length > 0 ? (
                        foodItems.map((food, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        className="w-16 h-16 object-cover rounded-full mr-4"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg">{food.name}</h3>
                                        <p className="text-sm text-gray-600">{food.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaEdit className="text-gray-500 cursor-pointer" />
                                    <FaTrashAlt className="text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No food items available.</p>
                    )}
                </div>
            </div>

            {/* Auditoriums Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <span className="mr-2">🏛️</span> Auditoriums
                    <a href="/vendorAddAuditoriums">
                        <FaPlus className="text-green-500 cursor-pointer" />
                    </a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto">
                    {auditoriums.length > 0 ? (
                        auditoriums.map((auditorium, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={auditorium.image}
                                        alt={auditorium.name}
                                        className="w-16 h-16 object-cover rounded-full mr-4"
                                    />
                                    <div>
                                        <h3 className="font-bold text-lg">{auditorium.name}</h3>
                                        <p className="text-sm text-gray-600">{auditorium.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaEdit className="text-gray-500 cursor-pointer" />
                                    <FaTrashAlt className="text-gray-500 cursor-pointer" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No auditoriums available</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default Home;