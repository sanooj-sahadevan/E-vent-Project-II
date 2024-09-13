/* eslint-disable @next/next/no-img-element */
"use client";
import { addDishAPI } from '@/services/vendorAPI';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
    DishesName: string;
    description: string;
    // images: File[];
    price: number;
    types: string;
    category: string;
    status: string;
};

const AddDishes = () => {
    const { control, handleSubmit, setValue, formState: { errors }, register } = useForm<FormValues>({
        defaultValues: {
            DishesName: "",
            description: "",
            // images: [],
            types: "",
            price: 0,
            category: "",
            status: "Upcoming",
        },
    });

    const router = useRouter();
    const [photos, setPhotos] = useState<File[]>([]);

    // Handle photo change for image input
    // const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const filesArray = Array.from(e.target.files);
    //         setPhotos((prevPhotos) => [...prevPhotos, ...filesArray]);

    //         // Update the form with the new photo list
    //         setValue("images", [...photos, ...filesArray]);
    //     }
    // };

    // Remove photo by index
    // const removePhoto = (index: number) => {
    //     const updatedPhotos = photos.filter((_, i) => i !== index);
    //     setPhotos(updatedPhotos);
    //     setValue("images", updatedPhotos);
    // };

    // Submit handler
    const onSubmit = async (data: FormValues) => {
        console.log('onsubmit');

        const formData = new FormData();
        formData.append("DishesName", data.DishesName);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("types", data.types);
        formData.append("category", data.category);
        formData.append("status", data.status);
        console.log(formData);

        // if (data.images) {
        //     data.images.forEach((image) => {
        //         formData.append(`images`, image, image.name);
        //     });
        // }

        try {
            const result = await addDishAPI(formData); // Make API call here
            console.log(result);

            if (result) {
                toast.success("Dish added successfully");
                setTimeout(() => {
                    router.push(`/vendor/dishes`); // Redirect after success
                }, 3000);
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            toast.error("Dish already exists!");
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Add Dishes</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <div className="flex space-x-6">
                    {/* Add Photo Section */}
                    <div className="w-1/3">
                        <div className="border border-gray-300 rounded-lg p-6 text-center">
                            {photos.length > 0 ? (
                                photos.map((photo, index) => (
                                    <div key={index} className="mb-4">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="Dish"
                                            className="w-full h-40 object-cover rounded-lg mb-4"
                                        />
                                        {/* <button
                                            type="button"
                                            className="bg-red-500 text-white px-2 py-1 rounded-lg"
                                            onClick={() => removePhoto(index)}
                                        >
                                            Remove
                                        </button> */}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 mb-4">Add Photos</div>
                            )}
                            {/* <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                id="dish-photo"
                                // onChange={handlePhotoChange}
                            /> */}
                            <label
                                htmlFor="dish-photo"
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600"
                            >
                                Upload Photo
                            </label>
                        </div>
                    </div>

                    {/* Add Details Section */}
                    <div className="w-2/3">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Dish Name</label>
                                <input
                                    type="text"
                                    {...register("DishesName", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter dish name"
                                />
                                {errors.DishesName && <p className="text-red-500">Dish name is required.</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    {...register("price", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter price"
                                />
                                {errors.price && <p className="text-red-500">Price is required.</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Type of Food</label>
                                <select
                                    {...register("types", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select type</option>
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                </select>
                                {errors.types && <p className="text-red-500">Type is required.</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Category</label>
                                <select
                                    {...register("category", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select category</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Platinum">Platinum</option>
                                    <option value="Silver">Silver</option>
                                </select>
                                {errors.category && <p className="text-red-500">Category is required.</p>}
                            </div>

                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    {...register("description", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter description"
                                />
                                {errors.description && <p className="text-red-500">Description is required.</p>}
                            </div>

                            <button
                                onClick={handleSubmit(onSubmit)}
                                className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                            >
                                Add Dish
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default AddDishes;
