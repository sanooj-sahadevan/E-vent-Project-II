'use client';
import { GoogleLoginAPI, LoginAPI } from "@/services/userApi";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/components/firebase/firebase";
import Image from "next/image";
import img from '../public/4.jpg.jpg';
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
    try {
      const result = await LoginAPI(data);
      if (result && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login Successful!", { duration: 8000 });
        window.location.href = "/"; // Navigate to desired page
      } else {
        toast.error("Invalid login credentials. Please try again.", { duration: 5000 });
      }
    } catch (err) {
      toast.error("An error occurred during login. Please try again.", { duration: 5000 });
    }
  };

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const googleLoginResult = await GoogleLoginAPI({
        email: result.user.email!,
        username: result.user.displayName!,
        profileImage: result.user.photoURL!,
        password: "",
        phone: result.user.phoneNumber || "",
      });
      if (googleLoginResult && googleLoginResult.user && googleLoginResult.token) {
        localStorage.setItem("token", googleLoginResult.token);
        localStorage.setItem("user", JSON.stringify(googleLoginResult.user));
        toast.success("Login Successful!", { duration: 2000 });
      } else {
        toast.error("Google authentication failed. Please try again.", { duration: 2000 });
      }
    } catch (error) {
      toast.error("Could not log in with Google. Please try again.", { duration: 2000 });
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen bg-white-100 p-8">
        <div className="flex-1 flex items-center justify-center bg-white-500">
          <Image
            src={img}
            alt="Sign up"
            className="object-cover max-w-full max-h-full"
            style={{ width: '95%', height: '85%' }}
          />
        </div>
        <div className="flex flex-col items-center justify-center w-2/5 px-6 space-y-6 bg-white">
          <h2 className="text-4xl font-bold text-gray-800">Log In</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-4/5">
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
                })}
                className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.email && <p className="text-red-500 text-xs">Email is error</p>}
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
                    value: /^(?=(?:.*[a-zA-Z]){3,})(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {errors.password && <p className="text-red-500 text-xs">Password is error</p>}
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH focus:outline-none focus:ring-2 focus:ring-buttonBg focus:ring-offset-2"
            >
              Log In
            </button>
          </form>
          <div className="text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-medium text-blue-500 hover:text-blue-700">
              Sign Up
            </a>
          </div>
          <div className="text-gray-500">
            Are you a vendor?{" "}
            <a href="/vendorLogin" className="font-medium text-blue-500 hover:text-blue-700">
              Log In here
            </a>
          </div>
          <div className="text-gray-500">
            Forgot your password?{" "}
            <a href="/forgottenPassword" className="font-medium text-blue-500 hover:text-blue-700">
              Click here
            </a>
          </div>
          <div>
            <button
              type="button"
              onClick={handleGoogleClick}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.35 11.1h-9.6v1.9h5.75c-.3 1.57-1.22 2.9-2.58 3.75v3.1h4.15c2.43-2.24 3.84-5.54 3.84-9.4 0-.7-.07-1.37-.18-2z" />
                <path d="M12.75 21.6c3.22 0 5.92-1.08 7.9-2.88l-4.15-3.1c-1.18.8-2.7 1.27-4.3 1.27-3.3 0-6.1-2.2-7.1-5.25h-4.3v3.3c1.98 3.88 6.13 6.65 10.95 6.65z" />
                <path d="M5.65 14.4c-.2-.55-.35-1.15-.35-1.75s.1-1.2.35-1.75v-3.3h-4.3c-.75 1.5-1.15 3.18-1.15 5s.4 3.5 1.15 5z" />
                <path d="M12.75 7.35c1.45 0 2.75.5 3.75 1.35l2.8-2.8c-1.8-1.7-4.5-2.75-7.55-2.75-4.82 0-8.97 2.77-10.95 6.65l4.3 3.3c1-3.05 3.8-5.25 7.1-5.25z" />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
