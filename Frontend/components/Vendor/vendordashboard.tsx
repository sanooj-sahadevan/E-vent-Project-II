/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEdit, FaPlus, FaTrashAlt } from 'react-icons/fa';
import { fetchDetailsVendor, FetchDishes, FetchAuditorium, deleteDish, deleteAuditorium, fetchReviews, approveReviewAPI, rejectReviewAPI } from '@/services/vendorAPI'; // Imported API functions
import 'react-toastify/dist/ReactToastify.css';
import { Plus } from 'lucide-react';

interface Review {
    _id: string; // Added _id for review identification
    userId: any;
    stars: number;
    username: string;
    rating: number;
    reviews: string;
    verified: boolean;
}

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

    const [reviews, setReviews] = useState<Review[] | null>(null);
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
                await fetchReview(query);
            }
        };

        fetchAllDetails();
    }, [query]);

    const fetchReview = async (vendorId: string) => {
        try {
            const Reviews = await fetchReviews(vendorId);
            setReviews(Reviews);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

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
            setAuditoriums(auditorium.filter((auditorium: { isDeleted: any; }) => !auditorium.isDeleted));
            setDishError(null);
        } catch (error) {
            console.error('Error fetching auditoriums:', error);
            setDishError('Failed to load auditoriums.');
            setAuditoriums([]);
        }
    };

    const handleDelete = async (dishId: string) => {
        if (!query) return;
        try {
            await deleteDish(dishId);
            await fetchDishes(query);
        } catch (error) {
            console.error('Error deleting dish:', error);
        }
    };

    const handleDeleteAuditorium = async (auditoriumId: string) => {
        if (!query) return;
        try {
            await deleteAuditorium(auditoriumId);
            await fetchAuditorium(query);
        } catch (error) {
            console.error('Error deleting auditorium:', error);
        }
    };

    const handleEditProfile = () => {
        if (vendorData) {
            const query = encodeURIComponent(JSON.stringify(vendorData));
            router.push(`/vendorEditProfile?query=${query}`);
        }
    };

    const rejectReview = async (reviewId: string) => {
        try {
            await rejectReviewAPI(reviewId);
            setReviews((prevReviews) => {
                if (!prevReviews) return null;
                return prevReviews.filter((review) => review._id !== reviewId);
            });
        } catch (error) {
            console.error('Error rejecting review:', error);
        }
    };

    const approveReview = async (reviewId: string) => {
        try {
            await approveReviewAPI(reviewId);
            setReviews((prevReviews) => {
                if (!prevReviews) return null;
                return prevReviews.map((review) =>
                    review._id === reviewId
                        ? { ...review, verified: true }
                        : review
                );
            });
        } catch (error) {
            console.error('Error approving review:', error);
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
                        {/* <a href="#" className="text-sm text-green-600 mt-2">
                            View Reviews
                        </a> */}
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
                        onClick={() => router.push('/slotBooking')}
                        className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600"
                    >
                        Create slot
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
                    <a href="/vendorAddDishes" className="text-black-500">
                        <Plus size={30} color="#000000" />                   </a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                    {dishError ? (
                        <p className="text-red-600 text-center">{dishError}</p>





                    ) : foodItems.length
                        > 0 ? (

                        foodItems.map((food) => (
                            <div key={food._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={food.images || '/placeholder.jpg'}
                                        alt={food.dishesName || 'Food Image'}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{food.dishesName}</h3>
                                        <p className="text-gray-500 text-sm">{food.description}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <a href={`/vendorEditDish?dishId=${food._id}`} className="text-gray-500 mr-2">
                                        <FaEdit />
                                    </a>
                                    <button onClick={() => handleDelete(food._id)} className="text-gray-500">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No dishes found</p>
                    )}
                </div>
            </div>

            {/* Auditorium Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span className="flex items-center"><span className="mr-2">🎭</span> Auditoriums</span>
                    <a href="/vendorAddAuditoriums" className="text-black-500">  <Plus size={30} color="#000000" /> </a>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                    {dishError ? (
                        <p className="text-red-600 text-center">{dishError}</p>
                    ) : auditoriums.length > 0 ? (
                        auditoriums.map((auditorium) => (
                            <div key={auditorium._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                                <div className="flex items-center">
                                    <img
                                        src={auditorium.images || '/placeholder.jpg'}
                                        alt={auditorium.auditoriumName || 'Auditorium Image'}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-semibold">{auditorium.auditoriumName}</h3>
                                        <p className="text-gray-500 text-sm">{auditorium.description}</p>
                                    </div>
                                </div>
                                <div className="flex">
                                    <a href={`/vendorEditAuditorium?auditoriumId=${auditorium._id}`} className="text-gray-500 mr-2">
                                        <FaEdit />
                                    </a>
                                    <button onClick={() => handleDeleteAuditorium(auditorium._id)} className="text-gray-500">
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No auditoriums found</p>
                    )}
                </div>
            </div>

            {/* Reviews Section */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md md:max-w-2xl mt-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span className="flex items-center"><span className="mr-2">⭐</span> Reviews</span>
                </h2>
                <div className="bg-white shadow-lg rounded-lg p-6 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 scrollbar-thumb-rounded-lg">
                    {reviews?.map((review) => (
                        <div key={review._id} className="flex items-center justify-between border-b border-gray-200 py-4">
                            <div>
                                <h3 className="font-semibold">{review.userId.username}</h3>
                                <p className="text-gray-500 text-sm">{review.reviews}</p>
                                <div className="flex items-center text-yellow-400">
                                    {Array.from({ length: review.stars }, (_, i) => (
                                        <span key={i}>⭐</span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex">
                                {!review.verified ? (
                                    <>
                                        <button
                                            onClick={() => approveReview(review._id)}
                                            className="text-sm text-green-500 mr-2"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => rejectReview(review._id)}
                                            className="text-sm text-red-500"
                                        >
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-green-500">✔</span>
                                )}
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
};

export default Home;
