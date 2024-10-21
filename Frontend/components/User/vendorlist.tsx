/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { allVendorAPI } from '@/services/userApi';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from '../skeletons/spinner';

interface Dishes {
    profileImage: string | undefined;
    profileimage: string | undefined;
    _id: string;
    image: string | undefined;
    vendorname: string;
    state: string;
    rating: number;
}

interface Vendor {
    _id: string;
    vendorname: string;
    state: string;
    rating: number;
    profileImage?: string;
}

interface VendorListProps {
    vendors: Vendor[];
}

const VendorsPage: React.FC<VendorListProps> = ({ vendors }: any) => {
    const router = useRouter();
    const [vendor, setVendor] = useState<Dishes[]>(vendors || []);
    const [loading, setLoading] = useState<boolean>(true);
    const [filteredVendors, setFilteredVendors] = useState<Dishes[]>(vendor);
    const [ratingFilter, setRatingFilter] = useState<number | null>(null);
    const [filterLoading, setFilterLoading] = useState<boolean>(false);
    
    // Pagination States
    const [currentPage, setCurrentPage] = useState<number>(1);
    const vendorsPerPage = 8;

    useEffect(() => {
        if (vendors?.length) {
            setFilteredVendors(vendors);
        } else {
            fetchVendor();
        }
    }, [vendors]);

    const fetchVendor = async () => {
        try {
            const response = await allVendorAPI();
            console.log('API Response:', response);

            if (Array.isArray(response)) {
                setVendor(response);
                setFilteredVendors(response);
            } else {
                console.error('Unexpected response format:', response);
                toast.error('Failed to load vendors. Please try again later.');
            }
        } catch (error) {
            router.push('/login');
            console.error('Failed to fetch vendors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendor();
    }, []);

    // Handle rating filter change
    const handleRatingFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRating = parseFloat(event.target.value);
        setRatingFilter(selectedRating);
        setFilterLoading(true);

        setTimeout(() => {
            if (selectedRating) {
                const filtered = vendor.filter((v) => v.rating >= selectedRating);
                setFilteredVendors(filtered);
            } else {
                setFilteredVendors(vendor);
            }
            setFilterLoading(false);
        }, 500);
    };

    // Pagination Logic
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastVendor = currentPage * vendorsPerPage;
    const indexOfFirstVendor = indexOfLastVendor - vendorsPerPage;
    const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="xl" color="gray" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-12 mb-12 p-8 bg-white shadow-xl rounded-lg">
            {/* Filter Section */}
            <div className="my-8">
                <div className="flex justify-end space-x-4 mb-6">
                    <div>Filter by</div>
                    <select className="border rounded px-2 py-1">
                        <option>Location</option>
                        <option>Location 1</option>
                        <option>Location 2</option>
                    </select>
                    {/* Rating Filter */}
                    <select
                        className="border rounded px-2 py-1"
                        value={ratingFilter || ''}
                        onChange={handleRatingFilterChange}
                    >
                        <option value="">Rating</option>
                        <option value="4.5">4.5 and above</option>
                        <option value="4">4.0 and above</option>
                        <option value="2.5">2.5 and above</option>
                    </select>
                </div>
            </div>

            {/* Vendor Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filterLoading ? (
                    <div className="flex justify-center items-center w-full h-64">
                        <Spinner size="lg" color="muted" />
                    </div>
                ) : currentVendors.length > 0 ? (
                    currentVendors.map((vendor, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg hover:shadow-2xl rounded-lg p-4 transform hover:scale-105 transition-transform duration-300"
                        >
                            <img
                                src={vendor.profileImage || vendor.profileimage || '/placeholder.png'}
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
                                    className="mt-4 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                                >
                                    Find Vendors
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex justify-center items-center w-full h-64">
                        <Spinner size="lg" color="muted" />
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8">
                {Array.from({ length: Math.ceil(filteredVendors.length / vendorsPerPage) }, (_, index) => (
                    <button
                        key={index}
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${currentPage === index + 1 ? 'bg-pink-500' : 'bg-gray-300'} text-white`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VendorsPage;
