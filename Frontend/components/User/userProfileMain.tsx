'use client';

import React, { useState, useEffect } from 'react';
import { UserEdit } from "@/services/userApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from '@mui/material/Skeleton';
import { useForm } from 'react-hook-form'; // React Hook Form

type UserProfile = {
  username: string;
  phone: string;
  email: string;
  profileImage: string;
  address: string;
  pincode: string;
  state: string;
};

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<UserProfile>();

  useEffect(() => {
    const storedUserProfile = localStorage.getItem('user');
    if (storedUserProfile) {
      try {
        const user: UserProfile = JSON.parse(storedUserProfile);
        setUserData(user);

        // Populate form values when editing
        Object.entries(user).forEach(([key, value]) => {
          setValue(key as keyof UserProfile, value);
        });

        setLoading(false);
      } catch (error) {
        setError('Error parsing user data from localStorage.');
        setLoading(false);
      }
    } else {
      setError('No user data found.');
      setLoading(false);
    }
  }, [setValue]);

  const onSubmit = async (updatedData: UserProfile) => {
    try {
      const result = await UserEdit(updatedData);

      if (result) {
        localStorage.setItem("user", JSON.stringify(result.data.data));
        setUserData(result.data.data);

        toast.success("User details updated successfully.");
        setIsEditing(false); // Exit editing mode
      }
    } catch (error) {
      toast.error("An error occurred while saving user details.");
      console.error("EditUser API error:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center mt-12 mb-12">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>

      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-[450px] border border-black">
        <div className="flex items-center justify-between w-full">
          <span
            className="ml-auto cursor-pointer"
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600 hover:text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15.232 5.232l3.536 3.536M9 13h6M19.071 4.929a1.5 1.5 0 00-2.121 0l-10 10a1.5 1.5 0 00-.354.708l-.829 3.536a1.5 1.5 0 001.848 1.848l3.536-.829a1.5 1.5 0 00.707-.354l10-10a1.5 1.5 0 000-2.121l-3.536-3.536z"
              />
            </svg>
          </span>
        </div>

        {!isEditing ? (
          <>
            <p className="mt-4 text-sm text-gray-800">Username: {userData?.username || 'N/A'}</p>
            <p className="mt-2 text-sm text-gray-800">Email: {userData?.email || 'N/A'}</p>
            <p className="mt-2 text-sm text-gray-800">Mobile: {userData?.phone || 'N/A'}</p>
            <p className="mt-2 text-sm text-gray-800">Address: {userData?.address || 'N/A'}</p>
            <p className="mt-2 text-sm text-gray-800">Pincode: {userData?.pincode || 'N/A'}</p>
            <p className="mt-2 text-sm text-gray-800">State: {userData?.state || 'N/A'}</p>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Edit Profile</h2>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Username:</label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  validate: (value) => value.trim() !== '' || 'Username cannot contain only spaces',
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Email:</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Invalid email format',
                  },
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Address:</label>
              <input
                {...register('address', {
                  required: 'Address is required',
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Pincode:</label>
              <input
                {...register('pincode', {
                  required: 'Pincode is required',
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">State:</label>
              <input
                {...register('state', {
                  required: 'State is required',
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Mobile:</label>
              <input
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/, // Ensures exactly 10 digits
                    message: 'Phone number must be 10 digits',
                  },
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Pincode:</label>
              <input
                {...register('pincode', {
                  required: 'Pincode is required',
                  pattern: {
                    value: /^[0-9]{6}$/, // Ensures exactly 6 digits
                    message: 'Pincode must be 6 digits',
                  },
                })}
                className="w-full p-2 border border-black rounded-lg focus:outline-none focus:border-pink-500 text-sm"
              />
              {errors.pincode && (
                <p className="text-red-500 text-sm">{errors.pincode.message}</p>
              )}
            </div>



            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 border border-black"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 border border-black"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
