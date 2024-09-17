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
  });

  useEffect(() => {
    // Fetch vendor profile from local storage on component mount
    const storedUserProfile = localStorage.getItem('user');

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
    setAddress({ ...address, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Update userData with the new address before saving
  const updatedUserData = {
    ...userData,  // Keep all existing user data
    address: `${address.street}, ${address.cityState}`, // Update address
    pincode: address.pinCode  // Update pincode
  };

  // Update the local userData state
  setUserData(updatedUserData);

  // Call the function to save updated user details
  await saveVendorDetails(updatedUserData);

  console.log('Address submitted:', address);
};

  const saveVendorDetails = async (updatedData: any) => {
    if (!updatedData) return;
  
    const reqBody = {
      username: updatedData.username, // Ensure it's correctly mapped
      phone: updatedData.phone,
      email: updatedData.email,
      profileImage: updatedData.profileImage,
      address: updatedData.address,
      pincode: updatedData.pincode,
      state: updatedData.state,
    };
  
    try {
      console.log('Sending user data to API:', reqBody);
      const result = await UserEdit(reqBody); // Assuming UserEdit is the API call
  
      if (result) {
        localStorage.setItem("user", JSON.stringify(result.data)); // Update localStorage with the updated user data
        toast.success("User details updated successfully.");
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
          {/* <h1 className="ml-2 text-xl font-semibold">
            {userData ? userData.name : 'Sanooj S'}
          </h1> */}
          <span className="ml-2 cursor-pointer">&#9998;</span>
        </div>
        <p className="mt-2">Username: {userData ? userData.username : 'Nill'}</p>
        <p className="mt-2">Email: {userData ? userData.email : 'Nill'}</p>
        <p>Mobile: {userData ? userData.phone : 'Nill'}</p>
        <p>Address: {userData?.address || 'Nill'}</p>
      </div>

      {/* Add Address Form */}
      <div className="mt-8 p-8 bg-white rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Add Address</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              name="street"
              placeholder="House Number, Street Number"
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              name="cityState"
              placeholder="City,State"
              onChange={handleInputChange}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              name="pinCode"
              placeholder="Pin Code"
              onChange={handleInputChange}
              className="p-2 border rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            type="submit"
            className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            Add Address
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
