/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import Image from "next/image";
import headerImage from "../public/1.jpg.jpg"; 

interface Vendor {
  _id: string;
  vendorname: string;
  state: string;
  rating: number;
  profileImage?: string;
}

const UserMain: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="relative w-full h-[80vh]">
        <Image
          src={headerImage}
          alt="Header Image"
          fill
          style={{ objectFit: "cover" }}
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
