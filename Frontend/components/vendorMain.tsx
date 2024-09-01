/* eslint-disable @next/next/no-img-element */
'use client'
import Image from 'next/image';
import headerImage from '../public/3.jpg.jpg';
import React, { useState } from 'react';

const Home = () => {
    const [photos, setPhotos] = useState([
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 1',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 2',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 3',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 4',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 5',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 6',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 7',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 8',
        },
        {
            src: 'https://picsum.photos/200/300',
            alt: 'Photo 9',
        },
    ]);

    const [showMore, setShowMore] = useState(false);

    const handleShowMore = () => {
        setShowMore(!showMore);
    };

    return (
        <div className="container mx-auto">
            {/* Header Image */}
            <div className="relative w-full h-[80vh]">
                <Image
                    src={headerImage}
                    alt="Header Image"
                    layout="fill"
                    objectFit="cover"
                />

                {/* Search Bar */}
                <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow p-3 rounded-l-lg border-2 border-white text-black bg-white shadow-lg"
                        />
                        <button className="bg-buttonBg text-white p-3 rounded-r-lg shadow-lg">
                            Find Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Vendor Card */}
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-12">
                <div className="md:flex justify-between p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">Vendor Name</h2>
                        <p className="mt-2 text-gray-600">
                            Address<br />
                            123 Main Street<br />
                            Anytown, IND 12345<br />
                            +91 98765 43210
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <div className="bg-green-500 text-white rounded-full px-4 py-1 text-sm">
                            4.7
                        </div>
                        <a href="#" className="text-sm text-green-600 mt-2">
                            View Reviews
                        </a>
                    </div>
                </div>
                <div className="flex justify-between p-6 bg-gray-50">
                    <button className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
                        Booking Details
                    </button>
                    <button className="bg-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-pink-600">
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* Photo Gallery */}
            <div className="w-full max-w-3xl mx-auto bg-white p-4 rounded-lg shadow-lg mt-8">
                <h2 className="text-2xl font-semibold mb-4">Photos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.slice(0, showMore ? photos.length : 4).map((photo, index) => (
                        <img
                            key={index}
                            src={photo.src}
                            alt={photo.alt}
                            className="w-full h-auto object-cover rounded-lg shadow-md"
                        />
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    {showMore ? (
                        <button
                            onClick={handleShowMore}
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                        >
                            View Less
                        </button>
                    ) : (
                        <button
                            onClick={handleShowMore}
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                        >
                            View More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
