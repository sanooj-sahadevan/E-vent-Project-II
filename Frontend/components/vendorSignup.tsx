/* eslint-disable @next/next/no-img-element */
"use client";

import { SignUpAPI } from "@/services/vendorAPI";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

type Inputs = {
  vendorname: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupForm: React.FC = () => {
    const router = useRouter();
    const {
      register,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm<Inputs>();
  
    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      const { vendorname, phone, email, password } = data;
  
      const reqBody = new FormData();
      reqBody.append("vendorname", vendorname || "");
      reqBody.append("phone", phone);
      reqBody.append("email", email);
      reqBody.append("password", password);
  
      const reqHeader = {
        "Content-Type": "application/json",
      };
  
      try {
        const result = await SignUpAPI(reqBody, reqHeader);
        console.log("SignUpAPI result:", result); // Debugging line
  
        if (result.error) {
          toast.error(result.message);
        } else if (result) {
          toast.success("OTP sent, please check your mail.");
          router.push(`/vendorOTP?email=${email}`);
        }
      } catch (err: any) {
        toast.error("Invalid credentials !");
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

<div className="flex min-h-screen bg-gray-100">
      <div className="w-1/2">
        <img
          src="https://media.istockphoto.com/id/1495018397/photo/splendid-view-of-an-outdoor-wedding-premises.jpg?s=2048x2048&w=is&k=20&c=WgMmtbGBe6ZEPoUpJQhdjJmX4QR1sBfqsc9bAXRSMo0="
          alt="Sign up"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 px-10 space-y-8 bg-white">
        <h2 className="text-4xl font-bold text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-3/4">
          <div>
            <label htmlFor="vendorname" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="vendorname"
              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("vendorname", { required: "Name is required" })}
            />
            {errors.vendorname && <p className="text-red-500">{errors.vendorname.message}</p>}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("email", { required: "Email is required", })}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="number"
              id="phone"
              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("password", { required: "Password is required",pattern: {
                value:
                  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                message: "Password must be at least 6 characters",
              }, })}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: value => value === getValues("password") || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
        <div className="text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-blue-500 hover:text-blue-700">
            Login
          </a>
        </div>
        {/* <div className="text-gray-500">
          Are you a vendor?{" "}
          <a href="#" className="font-medium text-blue-500 hover:text-blue-700">
            Sign up here
          </a>
        </div> */}
      </div>
    </div>
</>

    
  );
};

export default SignupForm;
