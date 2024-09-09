/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

type Inputs = {
    place: string;
    occupancy: number;
    description: string;
    type: string;  // Added type field
};

const AddAuditorium: React.FC = () => {
    const [photo, setPhoto] = useState<File | null>(null);
    const { register, handleSubmit, reset } = useForm<Inputs>();
    const router = useRouter();

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        // Perform form submission logic here
        // For example, send the data and photo to an API endpoint

        // Reset the form and photo state
        reset();
        setPhoto(null);

        // Notify user
        toast.success('Auditorium added successfully!');

        // Redirect to another page (optional)
        router.push('/some-other-page');
    };

    return (
        <div className="container mx-auto p-8">
                            <h1 className="text-3xl font-bold mb-8 text-center">Add Auditorium</h1>

            <ToastContainer />
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
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
                        <h2 className="text-2xl font-semibold mb-6">Add Details</h2>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Place</label>
                                <input
                                    type="text"
                                    {...register('place', { required: 'Place is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter place"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Occupancy</label>
                                <input
                                    type="number"
                                    {...register('occupancy', { required: 'Occupancy is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter occupancy"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type</label>
                                <select
                                    {...register('type', { required: 'Type is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select type</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Theater">Theater</option>
                                    <option value="Auditorium">Auditorium</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    {...register('description', { required: 'Description is required' })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter description"
                                />
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
            </div>
        </div>
    );
};

export default AddAuditorium;
