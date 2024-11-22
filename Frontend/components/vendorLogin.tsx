/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import { LoginAPI } from "@/services/vendorAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import img from '../public/3.jpg.jpg'


type LoginFormInputs = {
  email: string;
  password: string;
  keepMeSignedIn: boolean;
};

const VendorLoginForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  //   try {
  //     const result = await LoginAPI(data);
  //     console.log("LoginAPI result:", result); // Debugging line
  //     if (result && result.vendor && result.vendorToken) {
  //       localStorage.setItem("vendorToken", result.accessToken);
  //       localStorage.setItem("refreshToken", result.refreshToken);
  //       localStorage.setItem("vendor", JSON.stringify(result.vendor));
  //       router.push(`/vendordashboard?vendorId=${result.vendor._id}`);
  //       toast.success("Login Successful!");
  //     } else {
  //       toast.error("Invalid login credentials. Please try again.");
  //     }
  //   } catch (err) {
  //     toast.error("An error occurred during login. Please try again.");
  //   }
  // };

  // const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
  //   try {
  //     const result = await LoginAPI(data);
  //     console.log("LoginAPI result:", result); 
  //     if (result && result.vendor && result.accessToken && result.refreshToken) {
  //       console.log('create result');
        
  //       localStorage.setItem("vendorToken", result.accessToken);
  //       localStorage.setItem("RefreshToken", result.refreshToken);
  //       localStorage.setItem("vendor", JSON.stringify(result.vendor));
  //       router.push(`/vendordashboard?vendorId=${result.vendor._id}`);
  //       toast.success("Login Successful!");
  //     } else {
  //       toast.error("Invalid login credentials. Please try again.");
  //     }
  //   } catch (err:any) {
  //     console.error("Login error:", err); 
  //     toast.error(err.message); 
  //   }
  // };
  

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await LoginAPI(data);
      console.log("LoginAPI result:", result);
  
      if (result && result.vendor && result.accessToken && result.refreshToken) {
        localStorage.setItem("vendorToken", result.accessToken);
        localStorage.setItem("RefreshToken", result.refreshToken);
        localStorage.setItem("vendor", JSON.stringify(result.vendor));
        router.push(`/vendordashboard?vendorId=${result.vendor._id}`);
        toast.success("Login Successful!");
      } else {
        toast.error("Invalid login credentials. Please try again.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error(err.message); 
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
        <div className="hidden md:block flex-1">
          <Image
            src={img}
            alt="Sign up"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Vendor Log In</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
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
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: 'Password is required',
                  })}
                  className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
              >
                Log In
              </button>
            </form>
            <div className="text-gray-500 mt-4">
              Don't have an account?{" "}
              <a href="/vendorSignup" className="font-medium text-blue-500 hover:text-blue-700">
                Sign Up
              </a>
            </div>
          </div>
        </div>

      </div>

    </>

  );
}

export default VendorLoginForm;
