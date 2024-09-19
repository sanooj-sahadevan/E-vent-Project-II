/* eslint-disable @next/next/no-img-element */
"use client";
import { addAuditoriumAPI } from '@/services/vendorAPI';
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
    const { handleSubmit, formState: { errors }, register } = useForm<FormValues>({
        defaultValues: {
            auditoriumName: "",
            description: "",
            types: "",
            price: 0,
            category: "",
            capacity: 0,
            status: "",
        },
    });

    const router = useRouter();
    const [photo, setPhoto] = useState<File | null>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const removePhoto = () => {
        setPhoto(null);
    };

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const formData = new FormData();
        formData.append("auditoriumName", data.auditoriumName);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("types", data.types);
        formData.append("category", data.category);
        formData.append("capacity", data.capacity.toString());
        formData.append("status", data.status);

        if (photo) {
            formData.append("image", photo, photo.name);
        }

        try {
            console.log('Submitting FormData:', formData);

            const result = await addAuditoriumAPI(formData);
            if (result) {
                toast.success("Auditorium added successfully");
                setTimeout(() => {
                    router.push(`/vendordashboard`);
                }, 3000);
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
                        {/* Add Photo Section */}
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

                        {/* Add Details Section */}
                        <div className="w-2/3">
                            <div>
                                <label className="block text-gray-700">Auditorium Name</label>
                                <input
                                    type="text"
                                    {...register('auditoriumName', { required: 'Auditorium Name is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter auditorium name"
                                />
                                {errors.auditoriumName && <p className="text-red-500">{errors.auditoriumName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    {...register('price', { required: 'Price is required', min: 0 })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter price"
                                />
                                {errors.price && <p className="text-red-500">{errors.price.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Type</label>
                                <select
                                    {...register('types', { required: 'Type is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select type</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Theater">Theater</option>
                                    <option value="Auditorium">Auditorium</option>
                                </select>
                                {errors.types && <p className="text-red-500">{errors.types.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Category</label>
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select category</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Bronze">Bronze</option>
                                </select>
                                {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">capacity</label>
                                <input
                                    type="number"
                                    {...register('capacity', { required: 'capacity is required', min: 1 })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter capacity"
                                />
                                {errors.capacity && <p className="text-red-500">{errors.capacity.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            placeholder="Enter description"
                        />
                        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                    >
                        Add Auditorium
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddAuditorium;
