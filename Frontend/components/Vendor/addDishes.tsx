/* eslint-disable @next/next/no-img-element */
"use client";
import { addDishAPI } from '@/services/vendorAPI';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type FormValues = {
    dishesName: string;
    description: string;
    price: number;
    types: string;
    category: string;
    menu: string;
    status: string;
    vendorId: string; // Use string instead of mongoose.Schema.Types.ObjectId
};

const AddDishes: React.FC = () => {
    const { handleSubmit, formState: { errors }, register } = useForm<FormValues>({
        defaultValues: {
            dishesName: "",
            description: "",
            types: "",
            price: 0,
            category: "",
            menu: "",
            status: "Upcoming",
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
        formData.append("dishesName", data.dishesName);
        formData.append("description", data.description);
        formData.append("price", data.price.toString());
        formData.append("types", data.types);
        formData.append("category", data.category);
        formData.append("menu", data.menu);
        formData.append("status", data.status);
        if (photo) {
            formData.append("image", photo, photo.name);
        }


        const storedVendor = localStorage.getItem("vendor");
        let vendorId = '';
    
        if (storedVendor) {
            const parsedVendor = JSON.parse(storedVendor);
            vendorId = parsedVendor._id;
            console.log(vendorId);
        }
    
        try {
            console.log('Submitting FormData:', formData);
    
            const result = await addDishAPI(formData);
    
            console.log(result);
    
            if (result) {
                toast.success("Auditorium added successfully");
                setTimeout(() => {
                    router.push(`/vendordashboard?vendorId=${vendorId}`);
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
            <h1 className="text-3xl font-bold mb-8 text-center">Add Dishes</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <div className="flex space-x-6">
                    <div className="w-1/3">
                        <div className="border border-gray-300 rounded-lg p-6 text-center">
                            {photo ? (
                                <div className="mb-4">
                                    <img
                                        src={URL.createObjectURL(photo)}
                                        alt="Dish"
                                        className="w-full h-40 object-cover rounded-lg mb-4"
                                    />
                                    <button
                                        type="button"
                                        className="bg-pink-500 text-white px-2 py-1 rounded-lg"
                                        onClick={removePhoto}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <div className="text-gray-500 mb-4">Add Photo</div>
                            )}
                            <input
                                type="file"
                                id="dish-photo"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                            <label
                                htmlFor="dish-photo"
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600"
                            >
                                Upload Photo
                            </label>
                            <div className="mt-4">
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    {...register("description", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                                    placeholder="Enter description"
                                />
                                {errors.description && <p className="text-red-500">Description is required.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="w-2/3">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Dish Name</label>
                                <input
                                    type="text"
                                    {...register("dishesName", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter dish name"
                                />
                                {errors.dishesName && <p className="text-red-500">Dish name is required.</p>}
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
                                <label className="block text-gray-700">Menu</label>
                                <textarea
                                    {...register("menu", { required: true })}
                                    className="w-full p-2 border border-gray-300 rounded-lg mt-2"
                                    placeholder="Enter Menu"
                                />
                                {errors.menu && <p className="text-red-500">Menu is required.</p>}
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
                                {errors.types
                                
                                
                                
                                
                                
                                
                                
                                && <p className="text-red-500">Type is required.</p>}
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