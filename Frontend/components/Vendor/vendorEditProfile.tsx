/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa'; // For edit icon
import { app } from '@/components/firebase/firebase'; // Import Firebase app configuration
import { useRouter } from 'next/navigation';

interface Vendor {
  vendorname: string;
  phone: number;
  email: string;
  password: string;
  profileImage?: string;
  address: string;
  district: string;
  state: string;
  reviews: string;
  otp?: string;
  otpVerified?: boolean;
  adminVerified?: boolean;
}

const EditVendor: React.FC = () => {
  const [vendor, setVendor] = useState<Vendor>({
    vendorname: '',
    phone: 0,
    email: '',
    password: '',
    address: '',
    district: '',
    state: '',
    reviews: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await fetch('/api/vendor/1'); // Update the URL as necessary
        if (!response.ok) {
          throw new Error('Failed to fetch vendor data');
        }
        const data = await response.json();
        setVendor(data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVendor(prevVendor => ({
      ...prevVendor,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/vendor/1', {
        method: 'PUT', // Assuming you are using PUT to update the vendor
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendor), // Send the updated vendor object
      });

      if (!response.ok) {
        throw new Error('Failed to save vendor data');
      }

      const updatedVendor = await response.json();
      setVendor(updatedVendor);
      console.log('Vendor details updated:', updatedVendor);
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error updating vendor data:', error);
    }
  };



  

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vendor Info Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          {/* Edit button to toggle edit mode */}
          <button
            onClick={handleEditToggle}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300"
          >
            <FaEdit className="text-gray-700" />
          </button>
         
        </div>

        {/* Display edit form if in editing mode */}
        {isEditing ? (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="vendorname">
                Name
              </label>
              <input
                type="text"
                id="vendorname"
                name="vendorname"
                value={vendor.vendorname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={vendor.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="state">
                State
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={vendor.state}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="district">
                District
              </label>
              <input
                type="text"
                id="district"
                name="district"
                value={vendor.district}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">
                Phone
              </label>
              <input
                type="number"
                id="phone"
                name="phone"
                value={vendor.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600 transition duration-300"
            >
              Save
            </button>
          </form>
        ) : (
          // Display static information when not editing
          <div>
            <p className="text-lg font-semibold text-gray-800">Name: {vendor.vendorname}</p>
            <p className="text-lg font-semibold text-gray-800">Address: {vendor.address}</p>
            <p className="text-lg font-semibold text-gray-800">Phone: {vendor.phone}</p>
            <p className="text-lg font-semibold text-gray-800">State: {vendor.state}</p>
            <p className="text-lg font-semibold text-gray-800">District: {vendor.district}</p>
            <p className="mt-4 text-gray-700">{vendor.reviews}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditVendor;
