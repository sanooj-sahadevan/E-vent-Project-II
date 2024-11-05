'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { changePassword, savePassword } from '@/services/userApi';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SERVER_URL = 'http://your-server-url';

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  otp?: string;
};

interface User {
  email: string;
}

const PasswordUpdateForm: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const newPassword = watch('newPassword');

  useEffect(() => {
    const storedUserProfile = localStorage.getItem('user');
    if (storedUserProfile) {
      try {
        const parsedUser = JSON.parse(storedUserProfile) as User;
        setUser(parsedUser);
      } catch {
        toast.error('Error parsing user data from localStorage.');
      }
    }
  }, []);

  const onSubmit = async (data: Inputs) => {
    setLoading(true);

    if (!user || !user.email) {
      toast.error('User email not found.');
      setLoading(false);
      return;
    }

    try {
      await changePassword(user.email, data.newPassword);
      setOtpRequired(true);
      toast.success('Password update initiated. Please enter the OTP sent to your email.');
    } catch (error) {
      toast.error('Error updating password. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data: Inputs) => {
    if (!data.otp) {
      toast.error("OTP is required to complete password update.");
      return;
    }

    setLoading(true);

    try {
      await savePassword(user?.email || '', data.newPassword);
      toast.success("Password updated successfully!");
      setOtpRequired(false);
    } catch (error) {
      toast.error("OTP verification failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-10 mb-20">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 border border-black">
        <h2 className="text-2xl font-bold mb-4 text-center">Booking Details</h2>

        {!otpRequired ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...register("newPassword", {
                  required: "New password is required",
                  pattern: {
                    value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                    message: "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
                  },
                })}
              />
              {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}
            </div>

            <div>
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...register("confirmNewPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === (watch("newPassword") || "") || "Passwords do not match",
                })}
              />
              {errors.confirmNewPassword && <p className="text-red-500">{errors.confirmNewPassword.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-pink-400 text-white py-2 rounded-full focus:outline-none hover:bg-pink-500 transition-all"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmitOtp)} className="mt-6 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-pink-400"
                {...register("otp", { required: "OTP is required" })}
              />
              {errors.otp && <p className="text-red-500">{errors.otp.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-pink-400 text-white py-2 rounded-full focus:outline-none hover:bg-pink-500 transition-all"
                disabled={loading}
              >
                {loading ? 'Verifying OTP...' : 'Submit OTP'}
              </button>
            </div>
          </form>
        )}

        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
};

export default PasswordUpdateForm;
