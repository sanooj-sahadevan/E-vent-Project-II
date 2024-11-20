/* eslint-disable @next/next/no-img-element */
"use client";
import { addAuditoriumAPI, getPresignedUrl } from '@/services/vendorAPI'; // Ensure this API function is defined correctly
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
    capacity: number;
    auditoriumName: string;
    description: string;
    price: number;
    types: string;
    category: string;
    status: string;
    vendorId: string; // Use string for vendorId
};

const AddAuditorium: React.FC = () => {
    const { handleSubmit, register, formState: { errors } } = useForm<FormValues>();
    const router = useRouter();
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string>("");

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);

            try {
                const data = await getPresignedUrl(file.name, file.type);

                if (data.url) {
                    const uploadResult = await fetch(data.url, {
                        method: "PUT",
                        body: file,
                        headers: {
                            "Content-Type": file.type,
                        },
                    });

                    if (uploadResult.ok) {
                        const s3Url = data.url.split('?')[0];
                        setPhotoUrl(s3Url);
                        console.log("Image uploaded successfully:", s3Url);
                    } else {
                        console.error("Error uploading image to S3");
                    }
                } else {
                    console.error("Error fetching pre-signed URL");
                }
            } catch (error) {
                console.error("Error during file upload:", error);
            }
        }
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const trimmedData = {
            ...data,
            auditoriumName: data.auditoriumName.trim(),
            description: data.description.trim(),
            types: data.types.trim(),
            status: data.status.trim(),
            image: photoUrl,
        };

        const storedVendor = localStorage.getItem("vendor");
        let vendorId = '';

        if (storedVendor) {
            const parsedVendor = JSON.parse(storedVendor);
            vendorId = parsedVendor._id;
        }

        try {
            const result = await addAuditoriumAPI(trimmedData);
            if (result) {
                toast.success("Auditorium added successfully");
                setTimeout(() => {
                    router.push(`/vendordashboard?vendorId=${vendorId}`);
                }, 2000);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("An error occurred while adding the auditorium!");
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Add Auditorium</h1>
            <ToastContainer />
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex space-x-6">
                        <div className="w-1/3">
                            <div className="border border-gray-300 rounded-lg p-6 text-center">
                                {photo ? (
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Auditorium"
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                ) : (
                                    <div className="text-gray-500 mb-4">Add Photo</div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    id="auditorium-photo"
                                    onChange={handlePhotoChange}
                                />
                                <label
                                    htmlFor="auditorium-photo"
                                    className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600"
                                >
                                    Upload Photo
                                </label>
                            </div>
                        </div>
                        <div className="w-2/3">
                            <div>
                                <label className="block text-gray-700">Auditorium Name</label>
                                <input
                                    type="text"
                                    {...register('auditoriumName', { 
                                        required: 'Auditorium Name is required', 
                                        validate: value => value.trim() !== '' || 'No white spaces allowed' 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter auditorium name"
                                />
                                {errors.auditoriumName && <p className="text-red-500">{errors.auditoriumName.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Capacity</label>
                                <input
                                    type="number"
                                    {...register('capacity', { 
                                        required: 'Capacity is required', 
                                        min: { value: 1, message: 'Capacity must be at least 1' } 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter capacity"
                                />
                                {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    {...register('description', { 
                                        required: 'Description is required', 
                                        validate: value => value.trim() !== '' || 'No white spaces allowed' 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter description"
                                />
                                {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    {...register('price', { 
                                        required: 'Price is required', 
                                        min: { value: 0, message: 'Price cannot be negative' } 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter price"
                                />
                                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Types</label>
                                <input
                                    type="text"
                                    {...register('types', { 
                                        required: 'Types are required', 
                                        validate: value => value.trim() !== '' || 'No white spaces allowed' 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter types"
                                />
                                {errors.types && <p className="text-red-500">{errors.types.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Category</label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select category</option>
                                    <option value="gold">Gold</option>
                                    <option value="silver">Silver</option>
                                    <option value="platinum">Platinum</option>
                                </select>
                                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700">Status</label>
                                <input
                                    type="text"
                                    {...register('status', { 
                                        required: 'Status is required', 
                                        validate: value => value.trim() !== '' || 'No white spaces allowed' 
                                    })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter status"
                                />
                                {errors.status && <p className="text-red-500">{errors.status.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                        >
                            Add Auditorium
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAuditorium;
