/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import headerImage from "../public/1.jpg.jpg";
import headerImage1 from "../public/67e84fa35d5d498df8829bdc8897361d.jpg";
import headerImage2 from "../public/Header/1.jpg.jpg";
import headerImage3 from "../public/Header/2.jpg.jpg";
import headerImage4 from "../public/Header/3.jpg.jpg";
import headerImage5 from "../public/Header/11.jpg";
import headerImage6 from "../public/Header/12.jpg";
import headerImage7 from "../public/Header/13.jpg";
import headerImage8 from "../public/Header/14.jpeg";
import headerImage9 from "../public/Header/15.png";

const images = [
  headerImage,
  headerImage1,
   headerImage2,
  headerImage3,
  headerImage4,
  headerImage5,
  headerImage6,
  headerImage7,
  headerImage8,
  headerImage9,
  // headerImage10,
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
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

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
          priority
        />
        <div className="absolute bottom-[-5%] left-1/2 transform -translate-x-1/2 w-full max-w-3xl">
          <div className="flex">
            <input
              type="text"
              placeholder="Search vendors..."
              className="flex-grow p-3 rounded-lg text-black bg-white shadow-lg focus:outline-none focus:ring-0"
            />
            <button className="bg-pink-500 text-white p-3 rounded-lg shadow-lg">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserMain;
