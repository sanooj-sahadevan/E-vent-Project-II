/* eslint-disable @next/next/no-img-element */

'use client';
import React, { useEffect, useState } from 'react';
import { vendorDetails } from '@/services/vendorAPI';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define interfaces for data
interface Photo {
    src: string;
    alt: string;
}

interface VendorData {
    name: string;
    address: string;
    contact: string;
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

    const [showMore, setShowMore] = useState<boolean>(false);
    const [vendorData, setVendorData] = useState<VendorData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const handleShowMore = () => setShowMore(!showMore);

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const response = await vendorDetails(); // No arguments needed
                const data = await response.data; // Get the data directly
                setVendorData(data); // Set the fetched vendor data
            } catch (err) {
                setError('Failed to fetch vendor details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendorDetails(); // Call the function to fetch data
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const categories: Category[] = [
        { name: 'Platinum', description: 'Premium services with a personalized touch...', color: 'bg-indigo-100' },
        { name: 'Gold', description: 'Excellent services that balance luxury and value...', color: 'bg-yellow-100' },
        { name: 'Silver', description: 'Essential services at an affordable price...', color: 'bg-gray-100' },
    ];

    const foodItems: FoodItem[] = [
        { name: 'Sushi', description: 'Freshly made sushi rolls with a variety of fillings...', image: '/sushi.jpg' },
        { name: 'Pizza', description: 'Italian-style pizza with fresh ingredients...', image: '/pizza.jpg' },
        { name: 'Burger', description: 'Juicy burgers with customizable toppings...', image: '/burger.jpg' },
        { name: 'Pasta', description: 'Creamy pasta dishes with a rich flavor...', image: '/pasta.jpg' },
    ];

    const auditoriums: Auditorium[] = [
        { name: 'Orchid', description: 'Elegant auditorium for grand occasions...', image: '/orchid.jpg' },
        { name: 'Rose', description: 'Smaller venue for intimate events...', image: '/rose.jpg' },
        { name: 'Tulip', description: 'Modern auditorium with state-of-the-art facilities...', image: '/tulip.jpg' },
        { name: 'Sunflower', description: 'Bright venue ideal for daytime events...', image: '/sunflower.jpg' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Vendor Card */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <div className="md:flex justify-between p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">{vendorData?.name || 'Vendor Name'}</h2>
                        <p className="mt-2 text-gray-600">
                            {vendorData?.address || 'Address'}<br />
                            {vendorData?.contact || '+91 98765 43210'}
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">{vendorData?.rating || '4.7'}</div>
                        <a href="#" className="text-sm text-green-600 mt-2">View Reviews</a>
                    </div>
                </div>
                <div className="flex justify-between p-6 bg-gray-50">
                    <button onClick={() => router.push('/vendorBookingDetails')} className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
                        Booking Details
                    </button>
                    <button onClick={() => router.push('/vendorEditProfile')} className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-12">
                <h2 className="text-2xl font-semibold mb-6">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {photos.slice(0, showMore ? photos.length : 4).map((photo, index) => (
                        <img
                            key={index}
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-6">
                    <button
                        onClick={handleShowMore}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                    >
                        {showMore ? 'View Less' : 'View More'}
                    </button>
                </div>
            </div>

            {/* Categories Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12 p-8">
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
            </div>

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
