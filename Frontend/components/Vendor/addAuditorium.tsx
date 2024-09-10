/* eslint-disable @next/next/no-img-element */
"use client";
import { addAuditoriumAPI } from '@/services/vendorAPI';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
    auditoriumName: string;
    description: string;
    price: number;
    types: string;
    category: string;
    occupancy: number;
    status: string;
};

const AddAuditorium = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            auditoriumName: "",
            description: "",
            price: 0,
            types: "",
            category: "",
            occupancy: 0,
            status: "Upcoming",
        },
    });

    const router = useRouter();
    const [photo, setPhoto] = useState<File | null>(null);

    // Handle photo change for image input
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const file = e.target.files[0];
            setPhoto(file);
        }
    };

    // Submit handler
    const onSubmit = async (data: FormValues) => {
        console.log('onsubmit auditoriums');

        const formData = new FormData();
        formData.append("auditoriumName", data.auditoriumName);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("types", data.types);
        formData.append("category", data.category);
        formData.append("occupancy", data.occupancy.toString());
        // formData.append("status", data.status);

        if (photo) {
            formData.append("photo", photo, photo.name);
        }

        try {
            const result = await addAuditoriumAPI(formData); // Make API call here
            console.log(result);

            if (result) {
                toast.success("Auditorium added successfully");
                setTimeout(() => {
                    router.push(`/vendor/auditoriums`); // Redirect after success
                }, 3000);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error adding auditorium!");
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
                                    {...register('price', { required: 'Price is required' })}
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
                                <label className="block text-gray-700">Occupancy</label>
                                <input
                                    type="number"
                                    {...register('occupancy', { required: 'Occupancy is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter occupancy"
                                />
                                {errors.occupancy && <p className="text-red-500">{errors.occupancy.message}</p>}
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

                    {/* <div>
                        <label className="block text-gray-700">Status</label>
                        <select
                            {...register('status', { required: 'Status is required' })}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Completed">Completed</option>
                        </select>
                        {errors.status && <p className="text-red-500">{errors.status.message}</p>}
                    </div> */}

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
