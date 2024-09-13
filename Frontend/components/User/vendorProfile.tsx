/* eslint-disable @next/next/no-img-element */
'use client';
import React from "react";
import { useRouter } from "next/navigation";

interface Vendor {
  image: string | undefined;
  vendorname: string;
  email: string;
  state: string;
  rating: number;
  reviews: Array<{ name: string; review: string; rating: number }>;
  photos: string[];
}

const vendorData: Vendor = {
  image: "/vendor-image.jpg",
  vendorname: "Lakme",
  email: "somephotoes007@gmail.com",
  state: "Coimbatore",
  rating: 4.5,
  reviews: [
    { name: "Muhammad Riyan", review: "So cool!", rating: 5.0 },
    { name: "John Doe", review: "Great service!", rating: 4.5 },
    { name: "Jane Smith", review: "Nice experience!", rating: 4.0 },
  ],
  photos: Array(9).fill("/photo-1.jpg"), // Dummy photo URLs
};

const VendorsPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="relative bg-gray-100 p-6 rounded-lg shadow-md">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('/vendor-bg.jpg')` }}
        ></div>
        <div className="relative z-10 flex items-center space-x-6">
          <img
            src={vendorData.image || "/default-vendor.jpg"}
            alt="Vendor Image"
            className="rounded-full w-24 h-24 object-cover border-4 border-white"
          />
          <div>
            <h1 className="text-2xl font-semibold">{vendorData.vendorname}</h1>
            <p>{vendorData.email}</p>
            <p>{vendorData.state}</p>
          </div>
        </div>
        <div className="absolute right-6 top-6 flex space-x-4 z-10">
          <button className="px-4 py-2 bg-pink-500 text-white rounded">Chat</button>
          <button className="px-4 py-2 bg-black text-white rounded">Call</button>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold">Platinum</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            volutpat eros non urna fermentum.
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold">Gold</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            volutpat eros non urna fermentum.
          </p>
        </div>
        <div className="bg-gray-200 p-4 rounded-md shadow">
          <h3 className="text-lg font-semibold">Silver</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
            volutpat eros non urna fermentum.
          </p>
        </div>
      </div>

      {/* Photos */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Photos</h2>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {vendorData.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Vendor Photo ${index + 1}`}
              className="object-cover w-full h-40 rounded-md"
            />
          ))}
        </div>
        <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded">View More</button>
      </div>

      {/* Reviews */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="space-y-4 mt-4">
          {vendorData.reviews.map((review, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-md shadow-md">
              <div className="flex justify-between">
                <p>{review.name}</p>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">
                    {"★".repeat(Math.round(review.rating))}
                  </span>
                  <span>{review.rating}</span>
                </div>
              </div>
              <p>{review.review}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex space-x-4">
          <button className="px-4 py-2 bg-pink-500 text-white rounded">Write a Review</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded">View All</button>
        </div>
      </div>
    </div>
  );
};

export default VendorsPage;
