// UpdatePasswordForm.js
'use client';
import React, { Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { updatePassword } from "@/services/userApi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import img from '@/public/4.jpg.jpg';

type Inputs = {
    password: string;
    confirmPassword: string;
};

const UpdatePasswordForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams?.get("email");

    const { register, handleSubmit, getValues, formState: { errors } } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const { password } = data;
        const reqBody = { email, password };

        try {
            const result = await updatePassword(reqBody);
            toast.success("Password updated successfully.");
            router.push(`/login`);
        } catch (err) {
            console.error('updatePassword error:', err);
            toast.error("An error occurred during password update. Please try again.");
        }
    };

    return (
        <>
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
            <div className="flex min-h-screen bg-white-100 p-8">
                <div className="w-1/2">
                    <Image src={img} alt="Update Password" className="object-cover w-full h-full" />
                </div>
                <div className="flex flex-col items-center justify-center w-1/2 px-10 space-y-8 bg-white">
                    <h2 className="text-4xl font-bold text-gray-800">Update Password</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-3/4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input type="password" id="password" {...register("password", { required: "Password is required", pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/, message: "Password must include uppercase, lowercase, number, and special character." } })} className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3" />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input type="password" id="confirmPassword" {...register("confirmPassword", { required: "Please confirm your password", validate: value => value === getValues("password") || "Passwords do not match" })} className="block w-full mt-1 rounded-md border border-gray-300 bg-white py-2 px-3" />
                            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
                        </div>
                        <button type="submit" className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-white bg-buttonBg border border-transparent rounded-md hover:bg-buttonBgH">Update Password</button>
                    </form>
                </div>
            </div>
        </>
    );
};

// Wrapping in Suspense for the SearchParams
const UpdatePasswordWrapper: React.FC = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <UpdatePasswordForm />
    </Suspense>
);

export default UpdatePasswordWrapper;
