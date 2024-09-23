/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { fetchDetailsVendor, FetchDishes, FetchAuditorium, deleteDish, deleteAuditorium } from '@/services/vendorAPI'; // Assuming deleteAuditorium is the soft delete API
import 'react-toastify/dist/ReactToastify.css';

interface VendorData {
    vendorname: string;
    email: string;
    state?: string;
    phone: number;
    rating: string;
    profileImage?: string;
}

interface FoodItem {
    _id: string;  // Include _id to identify items for delete
    images: string | undefined;
    dishesName: string | undefined;
    description: string;
    isDeleted?: boolean; // Add soft delete flag
}

interface Auditorium {
    _id: string;  // Include _id for delete
    auditoriumName: string | undefined;
    description: string | undefined;
    images: string;
}

const Home: React.FC = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('vendorId');
    const router = useRouter();

    const [vendorData, setVendorData] = useState<VendorData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [auditoriums, setAuditoriums] = useState<Auditorium[]>([]);
    const [dishError, setDishError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                if (!query) {
                    setError('Vendor ID not provided.');
                    setLoading(false);
                    return;
                }

                const data = await fetchDetailsVendor(query);
                setVendorData(data);
                setError(null);
            } catch (err) {
                setError('Failed to load vendor details.');
                setVendorData({
                    vendorname: 'N/A',
                    email: 'N/A',
                    phone: 0,
                    state: 'N/A',
                    rating: 'N/A',
                    profileImage: '',
                });
            } finally {
                setLoading(false);
            }
        };

        const fetchAllDetails = async () => {
            await fetchVendorDetails();
            if (query) {
                await fetchAuditorium(query);
                await fetchDishes(query);
            }
        };

        fetchAllDetails();
    }, [query]);

    const fetchDishes = async (vendorId: string) => {
        try {
            const dishes = await FetchDishes(vendorId);
            setFoodItems(dishes.filter((dish: { isDeleted: any; }) => !dish.isDeleted));
            setDishError(null);
        } catch (error) {
            console.error('Error fetching dishes:', error);
            setDishError('Failed to load dishes.');
            setFoodItems([]);
        }
    };

    const fetchAuditorium = async (vendorId: string) => {
        try {
            const auditorium = await FetchAuditorium(vendorId);
            setAuditoriums(auditorium);
            setDishError(null);
        } catch (error) {
            console.error('Error fetching auditoriums:', error);
            setDishError('Failed to load auditoriums.');
            setAuditoriums([]);
        }
    };

    const handleDelete = (dishId: string) => {
        if (!query) return;
        deleteDish(dishId)
            .then(response => {
                console.log('Dish deleted successfully', response);
                fetchDishes(query);
            })
            .catch(error => {
                console.error('Error deleting dish:', error);
            });
    };

    const handleDeleteAuditorium = (auditoriumId: string) => {
        if (!query) return;
        deleteAuditorium(auditoriumId)
            .then((response: any) => {
                console.log('Auditorium deleted successfully', response);
                fetchAuditorium(query);
            })
            .catch((error: any) => {
                console.error('Error deleting auditorium:', error);
            });
    };

    const handleEditProfile = () => {
        if (vendorData) {
            const query = encodeURIComponent(JSON.stringify(vendorData));
            router.push(`/vendorEditProfile?query=${query}`);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Vendor Card */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <div className="flex items-center justify-center mb-6">
                    {vendorData?.profileImage ? (
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-300">
                            <img
                                src={vendorData.profileImage}
                                alt="Vendor"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
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
                            {vendorData?.rating || 'N/A'}
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

            {/* Food Items Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span className="flex items-center"><span className="mr-2">🍲</span> Food Items</span>
                    <a href="/vendorAddDishes" className="text-green-500"><FaPlus /></a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                    {dishError ? (
                        <p className="text-red-600 text-center">{dishError}</p>
                    ) : foodItems.length > 0 ? (
                        foodItems.map((food) => (
                            <div key={food._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={food.images}
                                        alt={food.dishesName}
                                        className="w-12 h-12 object-cover rounded-full mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg">{food.dishesName}</h3>
                                        <p className="text-sm text-gray-600 truncate">{food.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaEdit className="text-gray-500 cursor-pointer" />
                                    <FaTrashAlt
                                        className="text-black cursor-pointer"
                                        onClick={() => handleDelete(food._id)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No food items found.</p>
                    )}
                </div>
            </div>

            {/* Auditorium Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span className="flex items-center"><span className="mr-2">🏛️</span> Auditorium</span>
                    <a href="/auditoriumAdd" className="text-green-500"><FaPlus /></a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                    {dishError ? (
                        <p className="text-red-600 text-center">{dishError}</p>
                    ) : auditoriums.length > 0 ? (
                        auditoriums.map((auditorium) => (
                            <div key={auditorium._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={auditorium.images}
                                        alt={auditorium.auditoriumName}
                                        className="w-12 h-12 object-cover rounded-full mr-4"
                                    />
                                    <div className="flex flex-col">
                                        <h3 className="font-bold text-lg">{auditorium.auditoriumName}</h3>
                                        <p className="text-sm text-gray-600 truncate">{auditorium.description}</p>
                                    </div>
                                </div>
                                <FaTrashAlt
                                    className="text-black cursor-pointer"
                                    onClick={() => handleDeleteAuditorium(auditorium._id)}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No auditorium details found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
