/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { allVendorAPI } from '@/services/userApi';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import img1 from '@/public/joinourteam.jpg'
import img2 from '@/public/samantha-gades-x40Q9jrEVT0-unsplash.jpg'
import Link from 'next/link';
import Spinner from './skeletons/spinner';

interface Vendor {
  vendorname: string;
  profileImage: string;
  _id: string;
  category: string;
  rating: number;
}

const Home: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await allVendorAPI();
        const sortedVendors = response.sort((a: { rating: number }, b: { rating: number }) => b.rating - a.rating).slice(0, 4);
        setVendors(sortedVendors);
        setAllVendors(response);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" color="gray" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Top Rated Vendors */}
      <div className="w-full">
        <h2 className="text-center mt-12 lg:mt-24 text-xl lg:text-2xl font-bold">Top Rated Vendors</h2>
        <div className="flex flex-wrap justify-center space-x-4 lg:space-x-10 mt-8 lg:mt-10">
          {vendors.length > 0 ? (
            vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="relative group flex flex-col items-center justify-between bg-white border shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg p-4 h-[260px] lg:h-[300px] w-[200px] lg:w-[270px] space-y-2"
              >
                <div className="relative w-full h-32 lg:h-45 mb-4">
                  <img
                    src={vendor.profileImage}
                    alt={vendor.vendorname}
                    className="rounded-lg object-cover w-full h-full transition-all duration-300 ease-in-out group-hover:blur-sm group-hover:brightness-50"
                  />
                  <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg lg:text-xl font-semibold mb-2">
                      {vendor.vendorname}
                    </p>
                    <Link href={`/vendor`} legacyBehavior>
                      <a className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 hover:text-white transition-colors">
                        View Vendor
                      </a>
                    </Link>
                  </div>
                </div>
                <p className="text-gray-600 text-center text-sm lg:text-base">{vendor.category}</p>
              </div>
            ))
          ) : (
            <p className="text-center">No vendors found.</p>
          )}
        </div>
      </div>

      {/* Professional Event Planning Section */}
      <div className="py-10 relative">
        <div className="relative w-full h-[40vh]">
          <Image
            src={img2}
            alt="Join Our Community"
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-6 max-w-md lg:max-w-lg mx-auto text-center">
            <h3 className="text-gray-500 text-sm font-semibold mb-2">Events</h3>
            <h2 className="text-gray-800 text-xl lg:text-2xl font-bold mb-4">Professional Event Planning</h2>
            <p className="text-gray-600 text-sm lg:text-base">
              Experience the convenience of personalized service, tailored to meet your company's unique needs. Our experts handle everything from venue selection to logistics, so you can focus on your business.
            </p>
          </div>
        </div>
      </div>

      {/* All Vendors Slider */}
      <div className="py-10 bg-gray-100">
        <h2 className="text-center text-xl lg:text-2xl font-bold">Top Brand Vendors</h2>
        <div className="mt-6">
          <Slider {...sliderSettings}>
            {allVendors.length > 0 ? (
              allVendors.map((vendor) => (
                <div key={vendor._id} className="p-2">
                  <div className="flex flex-col items-center justify-between bg-white border shadow-md rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg p-4 h-[260px] lg:h-[300px] w-[200px] lg:w-[270px] space-y-2">
                    <div className="relative w-full h-32 lg:h-40 mb-4">
                      <img
                        src={vendor.profileImage}
                        alt={vendor.vendorname}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                    <p className="text-lg lg:text-xl font-semibold text-gray-800 text-center">
                      {vendor.vendorname}
                    </p>
                    <p className="text-gray-600 text-center">{vendor.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">No vendors found.</p>
            )}
          </Slider>
        </div>
      </div>

      {/* Join Our Community Section */}
      <div className="py-10 relative">
        <div className="relative w-full h-[40vh]">
          <Image
            src={img1}
            alt="Join Our Community"
            fill
            style={{ objectFit: "cover" }}
            className="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center items-center bg-white bg-opacity-10">
          <h2 className="text-white text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">Join our Community</h2>
          <div className="flex items-center space-x-2">
            <input
              type="email"
              placeholder="Enter your Email ID"
              className="w-64 lg:w-80 px-4 py-2 lg:py-3 rounded-l-md border border-white text-white placeholder-white bg-transparent focus:outline-none focus:ring-2 focus:ring-white transition duration-300"
            />
            <button className="px-4 lg:px-6 py-2 lg:py-3 bg-transparent text-white border border-white font-semibold rounded-r-md hover:bg-white hover:text-gray-800 transition duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
