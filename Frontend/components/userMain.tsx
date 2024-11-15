// /* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import headerImage from '../public/1.jpg';
// import { searchUsers } from '@/services/userApi';

// interface Vendor {
//     _id: string;
//     vendorname: string;
//     state: string;
//     rating: number;
//     profileImage?: string;
// }
// interface UserMainProps {
//     setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
// }

// const UserMain: React.FC<UserMainProps> = ({ setVendors }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);
//     const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//     useEffect(() => {
//         if (debounceTimeoutRef.current) {
//             clearTimeout(debounceTimeoutRef.current);
//         }

//         debounceTimeoutRef.current = setTimeout(() => {
//             if (searchTerm.trim()) {
//                 searchVendors(searchTerm);
//             } else {
//                 setVendors([]); // Clear vendors if the search term is empty
//             }
//         }, 300);

//         return () => {
//             if (debounceTimeoutRef.current) {
//                 clearTimeout(debounceTimeoutRef.current);
//             }
//         };
//     }, [searchTerm, setVendors]); // Add setVendors to the dependency array

//     const searchVendors = async (term: string) => {
//         try {
//             setLoading(true);
//             const response = await searchUsers(term);
//             setVendors(response.data || []); // Ensure vendors are set properly
//         } catch (error) {
//             console.error('Error fetching vendors:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="container mx-auto">
//             <div className="relative w-full h-[80vh]">
//                 <Image
//                     src={headerImage}
//                     alt="Header Image"
//                     layout="fill"
//                     objectFit="cover"
//                 />
//                 <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
//                     <div className="flex">
//                         <input
//                             type="text"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             placeholder="Search vendors..."
//                             className="flex-grow p-3 rounded-lg text-black bg-white shadow-lg focus:outline-none focus:ring-0"
//                         />
//                         <button className="bg-buttonBg text-white p-3 rounded-lg shadow-lg" disabled={loading}>
//                             {loading ? 'Searching...' : 'Find Services'}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div
//     );
// };

// export default UserMain;


/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import headerImage from '../public/1.jpg';
import headerImage1 from '../public/67e84fa35d5d498df8829bdc8897361d.jpg';

import headerImage2 from '../public/f16ca33a8327ac1e8b68e590bd4c8a2a.jpg';


// Array of image paths in the 'public' folder
const images = [
    headerImage, headerImage2, headerImage1,// Ensure these images are in the public folder (e.g., public/1.jpg)
 
  // Add more images as needed
];

interface Vendor {
  _id: string;
  vendorname: string;
  state: string;
  rating: number;
  profileImage?: string;
}

const UserMain: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Set an interval to change the image index every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="relative w-full h-[80vh]">
        <Image
          src={images[currentIndex]}
          alt={`Slideshow Image ${currentIndex + 1}`}
          fill
          style={{ objectFit: "cover" }}
          priority // Ensures the first image loads quickly
        />
        <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
          <div className="flex">
            <input
              type="text"
              placeholder="Search vendors..."
              className="flex-grow p-3 rounded-lg text-black bg-white shadow-lg focus:outline-none focus:ring-0"
            />
            <button className="bg-buttonBg text-white p-3 rounded-lg shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
