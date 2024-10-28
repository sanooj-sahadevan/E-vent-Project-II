'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserEdit } from "@/services/userApi";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState({
    street: '',
    cityState: '',
    pinCode: '',
    state: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedUserProfile = localStorage.getItem('user');
    if (storedUserProfile) {
      try {
        const user = JSON.parse(storedUserProfile);
        setUserData(user);
        setLoading(false);
      } catch (error) {
        setError('Error parsing user data from localStorage.');
        setLoading(false);
      }
    } else {
      setError('No user data found.');
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUserData = {
      ...userData,
      address: `${address.street}, ${address.cityState}`,
      pincode: address.pinCode,
      state: address.state,
    };

    setUserData(updatedUserData);

    try {
      await saveVendorDetails(updatedUserData);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  const saveVendorDetails = async (updatedData: any) => {
    if (!updatedData) return;

    const reqBody = {
      username: updatedData.username,
      phone: updatedData.phone,
      email: updatedData.email,
      profileImage: updatedData.profileImage,
      address: updatedData.address,
      pincode: updatedData.pincode,
      state: updatedData.state,
    };

    try {
      const result = await UserEdit(reqBody);
      if (result) {
        localStorage.setItem("user", JSON.stringify(result.data));
        toast.success("User details updated successfully.");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("An error occurred while saving user details.");
      console.error('EditUser API error:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-96">
        <div className="flex items-center">
          <span className="text-pink-500 text-3xl">&#128100;</span>
          <span className="ml-2 cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-500 hover:text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13h6M19.071 4.929a1.5 1.5 0 00-2.121 0l-10 10a1.5 1.5 0 00-.354.708l-.829 3.536a1.5 1.5 0 001.848 1.848l3.536-.829a1.5 1.5 0 00.707-.354l10-10a1.5 1.5 0 000-2.121l-3.536-3.536z" />
            </svg>
          </span>
        </div>
        <p className="mt-2">Username: {userData ? userData.username : 'Nill'}</p>
        <p className="mt-2">Email: {userData ? userData.email : 'Nill'}</p>
        <p>Mobile: {userData ? userData.phone : 'Nill'}</p>
        <p>Address: {userData?.address || 'Nill'}</p>
      </div>

      {/* Add/Edit Address Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="mt-8 p-8 bg-white rounded-lg shadow-lg w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Street:</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">City, State:</label>
            <input
              type="text"
              name="cityState"
              value={address.cityState}
              onChange={handleAddressChange}
              className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Pin Code:</label>
            <input
              type="text"
              name="pinCode"
              value={address.pinCode}
              onChange={handleAddressChange}
              className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">State:</label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfilePage;
