/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import { LoginAPI } from "@/services/userApi";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { useRouter } from "next/navigation";

type Inputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const { email, password } = data;
    console.log(data.email, data.password); // Debugging line

    try {
      const result = await LoginAPI(data);
      console.log("LoginAPI result:", result); // Debugging line
      console.log('suk');

      if (result && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login Successful!");

        router.push("/adminDashboard");
      } else {
        toast.error("Invalid login credentials. Please try again.");

        // Handle invalid login credentials
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.");

      // Handle error
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
            alt="Log in"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex flex-col items-center justify-center w-3/5 px-10 space-y-8 bg-white">
          <h2 className="text-4xl font-bold text-gray-800"> Admin Log In</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-3/4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: true,
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email address is invalid",
                  },
                })} // Register the input
                className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs">Email is required</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: true,
                  pattern: {
                    value:
                      /^(?=(?:.*[a-zA-Z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                    message: "Password must be at least 6 characters",
                  },
                })} // Register the input
                className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs">Password is required</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
          {/* <div className="text-gray-500">
            Don't have an account?{" "}
            <a href="/signup" className="font-medium text-blue-500 hover:text-blue-700">
              Sign Up
            </a>
          </div>
          <div className="text-gray-500">
            Forgot your password?{" "}
            <a href="#" className="font-medium text-blue-500 hover:text-blue-700">
              Reset Password
            </a>
          </div> */}
        </div>
      </div>

    </>

  );
}

export default LoginForm;
