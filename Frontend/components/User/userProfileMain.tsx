'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserEdit } from "@/services/userApi";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // Holds user profile data
  const [loading, setLoading] = useState(true); // Tracks loading state
  const [error, setError] = useState<string | null>(null); // Tracks errors
  const [address, setAddress] = useState({
    street: '',
    cityState: '',
    pinCode: '',
    state: '', // Added state field
  });
  const [isEditing, setIsEditing] = useState(false); // Tracks if the user is editing

  useEffect(() => {
    const storedUserProfile = localStorage.getItem('user');
    console.log(storedUserProfile);
    
    if (storedUserProfile) {
      try {
        const user = JSON.parse(storedUserProfile);
        setUserData(user);
        setLoading(false);
      } catch (error) {
        setError('Error parsing vendor data from localStorage.');
        setLoading(false);
      }
    } else {
      setError('No vendor data found.');
      setLoading(false);
    }
  }, []); // Run once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value }); // Update userData directly
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update userData with the new address before saving
    const updatedUserData = {
      ...userData,  // Keep all existing user data
      address: `${address.street}, ${address.cityState}`, // Update address
      pincode: address.pinCode,  // Update pincode
      state: address.state,  // Update state
    };

    // Update the local userData state
    setUserData(updatedUserData);

    // Call the function to save updated user details
    await saveVendorDetails(updatedUserData);

    console.log('User details submitted:', updatedUserData);
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
      state: updatedData.state,  // Ensure state is included
    };

    try {
      console.log('Sending user data to API:', reqBody);
      const result = await UserEdit(reqBody); // Assuming UserEdit is the API call

      if (result) {
        localStorage.setItem("user", JSON.stringify(result.data)); // Update localStorage with the updated user data
        toast.success("User details updated successfully.");
        setIsEditing(false); // Turn off edit mode after saving
      }
    } catch (err) {
      toast.error("An error occurred while saving user details. Please try again.");
      console.error('EditUser API error:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Profile Section */}
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg w-96">
        <div className="flex items-center">
          <span className="text-pink-500 text-3xl">&#128100;</span>
          <span className="ml-2 cursor-pointer" onClick={() => setIsEditing(!isEditing)}>
            {/* SVG for edit icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black-500 hover:text-black-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13h6M19.071 4.929a1.5 1.5 0 00-2.121 0l-10 10a1.5 1.5 0 00-.354.708l-.829 3.536a1.5 1.5 0 001.848 1.848l3.536-.829a1.5 1.5 0 00.707-.354l10-10a1.5 1.5 0 000-2.121l-3.536-3.536z" />
            </svg>
          </span>
        </div>

        {/* Conditionally render input fields when editing */}
        <form onSubmit={handleSubmit} className="flex flex-col mt-4">
          <div className="mb-4">
            <label className="block text-gray-700">Username:</label>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={userData?.username || ''}
                onChange={handleInputChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{userData?.username || 'Nill'}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData?.email || ''}
                onChange={handleInputChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{userData?.email || 'Nill'}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={userData?.phone || ''}
                onChange={handleInputChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{userData?.phone || 'Nill'}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address:</label>
            {isEditing ? (
              <input
                type="text"
                name="street"
                placeholder="House Number, Street"
                onChange={handleAddressChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{isEditing ? address.street : userData?.address || 'Nill'}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Pin Code:</label>
            {isEditing ? (
              <input
                type="text"
                name="pinCode"
                value={address.pinCode}
                onChange={handleAddressChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{isEditing ? address.pinCode : userData?.pincode || 'Nill'}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">State:</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
              />
            ) : (
              <p>{isEditing ? address.state : userData?.state || 'Nill'}</p>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-2 mt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)} // Cancel editing
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
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
