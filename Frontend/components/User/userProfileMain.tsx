
'use client'
import React, { useState, useEffect } from 'react';
import { UserEdit } from "@/services/userApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Skeleton from '@mui/material/Skeleton';
import { FieldError, useForm } from 'react-hook-form';

const ProfilePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
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
        setAddress({
          street: user.address?.split(", ")[0] || '',
          cityState: user.address?.split(", ")[1] || '',
          pinCode: user.pincode || '',
          state: user.state || '',
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData: any) => ({ ...prevData, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({ ...prevAddress, [name]: value }));
  };

  const handleSubmitForm = async (formData: any) => {
    const updatedUserData = {
      ...userData,
      address: `${address.street}, ${address.cityState}`,
      pincode: address.pinCode,
      state: address.state,
    };

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
        localStorage.setItem("user", JSON.stringify(result.data.data));

        setUserData(result.data.data);
        setAddress({
          street: result.data.data.address?.split(", ")[0] || "",
          cityState: result.data.data.address?.split(", ")[1] || "",
          pinCode: result.data.data.pincode || "",
          state: result.data.data.state || "",
        });

        toast.success("User details updated successfully.");
        setIsEditing(false);
      }
    } catch (error: unknown) {
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
            <p className="mt-4 text-sm text-gray-800">Username: {userData ? userData.username : 'Nill'}</p>
            <p className="mt-2 text-sm text-gray-800">Email: {userData ? userData.email : 'Nill'}</p>
            <p className="mt-2 text-sm text-gray-800">Mobile: {userData ? userData.phone : 'Nill'}</p>
            <p className="mt-2 text-sm text-gray-800">Address: {userData?.address || 'Nill'}</p>
          </>
        ) : (


          <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-6 w-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Edit Profile</h2>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Username:</label>
              <input
                type="text"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /\S+/,
                    message: "Username cannot be empty or just whitespace"
                  }
                })}
                className={`w-full p-2 border ${errors.username ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
              {errors.username && <span className="text-red-500 text-sm">{(errors.username as FieldError)?.message}</span>}

            </div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Email:</label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Invalid email address"
                  }
                })}
                className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.email && <span className="text-red-500 text-sm">{(errors.email as FieldError)?.message}</span>}
</div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Mobile:</label>
              <input
                type="text"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Phone number must be digits only"
                  }
                })}
                className={`w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.phone && <span className="text-red-500 text-sm">{(errors.phone as FieldError)?.message}</span>}
</div>

            <h2 className="text-lg font-semibold text-gray-700 mt-5 mb-3">Edit Address</h2>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Street:</label>
              <input
                type="text"
                // name="street"
                {...register("street", {
                  required: "Street is required",
                  pattern: {
                    value: /\S+/,
                    message: "Street cannot be empty or just whitespace"
                  }
                })}
                className={`w-full p-2 border ${errors.street ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.street && <span className="text-red-500 text-sm">{(errors.street as FieldError)?.message}</span>}
</div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">City, State:</label>
              <input
                type="text"
                // name="cityState"
                {...register("cityState", {
                  required: "City, State is required",
                  pattern: {
                    value: /\S+/,
                    message: "City, State cannot be empty or just whitespace"
                  }
                })}
                className={`w-full p-2 border ${errors.cityState ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.cityState && <span className="text-red-500 text-sm">{(errors.cityState as FieldError)?.message}</span>}
</div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">Pin Code:</label>
              <input
                type="text"
                // name="pinCode"
                {...register("pinCode", {
                  required: "Pin Code is required",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "Pin code must be exactly 6 digits"
                  }
                })}
                className={`w-full p-2 border ${errors.pinCode ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.pinCode && <span className="text-red-500 text-sm">{(errors.pinCode as FieldError)?.message}</span>}
</div>

            <div className="mb-3">
              <label className="block text-gray-600 text-sm">State:</label>
              <input
                type="text"
                // name="state"
                {...register("state", {
                  required: "State is required",
                  pattern: {
                    value: /\S+/,
                    message: "State cannot be empty or just whitespace"
                  }
                })}
                className={`w-full p-2 border ${errors.state ? 'border-red-500' : 'border-black'} rounded-lg focus:outline-none focus:border-pink-500 text-sm`}
              />
{errors.state && <span className="text-red-500 text-sm">{(errors.state as FieldError)?.message}</span>}
</div>

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 border border-black text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 border border-black text-sm"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
