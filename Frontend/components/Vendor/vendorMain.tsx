/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import headerImage from '@/public/3.jpg.jpg'; 
import React, { useState } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface Photo {
    src: string;
    alt: string;
}

const Home: React.FC = () => {
   

    

    return (
        <div className="container mx-auto px-4 ">
            {/* Header Image */}
            <div className="relative w-full h-[80vh]">
                <Image
                    src={headerImage}
                    alt="Header Image"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                />

                {/* Search Bar */}
                <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="flex-grow p-3 rounded-l-lg border-2 border-white text-black bg-white shadow-lg"
                        />
                        <button className="bg-blue-500 text-white p-3 rounded-r-lg shadow-lg">
                            Find Services
                        </button>
                    </div>
                </div>
            </div>

            {/* Add white space below the search bar */}
            <div className="mt-16"></div> {/* Adjust the margin as needed */}
        
        </div>
    );
};

export default Home;
