/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState,useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Head from "next/head";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtp } from "../services/userApi";

interface OTPFormInputs {
  otp: string;
}



const OTPPage: React.FC = () => {
    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<OTPFormInputs>();
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute countdown
    const [isResendDisabled, setIsResendDisabled] = useState(true);
  
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const email = searchParams.get("email");
  
    // Handle OTP submission
    const handleOtpSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
      console.log(data, email,'----------------------------');
  
      try {
        await verifyOtp({ otp: data.otp, email });
  console.log('vannn');
  
        toast.success("please login");
        router.push("/login");
      } catch (error) {
        console.error(error);
        toast.error("Invalid otp.");
      }
    };
  
    // Handle Resend OTP click
    const handleResendOtp = () => {
      console.log("Resend OTP");
      setTimeLeft(60);
      setIsResendDisabled(true);
      // Logic to resend OTP (e.g., call an API)
    };
  
    // Countdown timer logic
    useEffect(() => {
      if (timeLeft === 0) {
        setIsResendDisabled(false);
      }
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }, [timeLeft]);
  

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
<div className="w-1/2">
        <img
          src="https://media.istockphoto.com/id/1495018397/photo/splendid-view-of-an-outdoor-wedding-premises.jpg?s=2048x2048&w=is&k=20&c=WgMmtbGBe6ZEPoUpJQhdjJmX4QR1sBfqsc9bAXRSMo0="
          alt="Log in"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-3/5 px-10 space-y-8 bg-white">
        <h2 className="text-4xl font-bold text-gray-800">Otp Verification</h2>
        <form onSubmit={handleSubmit(handleOtpSubmit)} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              OTP
            </label>
            <input
              type="number"
              id="otp"
              {...register("otp", {
                required: "OTP is required",
                pattern: /^[0-9]{4}$/,
              })}              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          {errors.otp && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {errors.otp.message || "Enter a valid 6-digit OTP"}
              </p>
            )}
          <button
            type="submit"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
            {isResendDisabled ? (
              <p className="text-sm text-gray-600">
                Resend OTP in{" "}
                <span className="font-medium text-gray-900">
                  {timeLeft} seconds
                </span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-500 font-medium text-sm"
              >
                Resend OTP
              </button>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            By creating an account, you agree with our{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              Privacy Statement
            </a>
            </p>

      </div>
    </div>
    </>
   
  );
};

export default OTPPage;
