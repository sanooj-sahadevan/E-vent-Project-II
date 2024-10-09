/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';
import img from '../public/4.jpg.jpg';
import { useRouter } from 'next/navigation';
import { ForgotenAPI } from '@/services/userApi'; // Adjust this import path accordingly

type Inputs = {
  email: string;
};

const ForgottenPassword: React.FC = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log("Submitting email:", data.email);
      const result = await ForgotenAPI({ email: data.email }); 

      console.log('API result:', result); 

      toast.success('Email verification sent!');

      router.push(`/forgototp?otp=${result.otp}&email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to verify email. Please try again.');
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

<div className="flex min-h-screen bg-white-100 p-8">
  <div className="flex-1 flex items-center justify-center bg-white-200">
    <Image
      src={img}
      alt="Forgot Password"
      className="object-cover max-w-full max-h-full"
      style={{ width: '80%', height: '80%' }} // Adjust as needed
    />
  </div>

  <div className="flex flex-col items-center justify-center w-2/5 px-6 space-y-6 bg-white"> {/* Reduced width and padding */}
    <div className="w-full max-w-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Email address is invalid',
              },
            })}
            className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
        >
          Verify Email
        </button>
      </form>
    </div>
  </div>
</div>


    </>
  );
};

export default ForgottenPassword;
 