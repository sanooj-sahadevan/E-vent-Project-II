/* eslint-disable @next/next/no-img-element */

'use client'
import React, { useState } from 'react';

const AddDishes: React.FC = () => {
    const [photo, setPhoto] = useState<File | null>(null);
    const [menu, setMenu] = useState({
        dishName: '',
        price: '',
        type: '',
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMenu(prevMenu => ({ ...prevMenu, [name]: value }));
    };

    const handleSubmit = () => {
        // Handle submission logic here
        console.log('Submitted:', { photo, menu });
    };

    return (


        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8 text-center">Add Dishes</h1>

            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                <div className="flex space-x-6">
                    {/* Add Photo Section */}
                    <div className="w-1/3">
                        <div className="border border-gray-300 rounded-lg p-6 text-center">
                            {photo ? (
                                <img
                                    src={URL.createObjectURL(photo)}
                                    alt="Dish"
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                            ) : (
                                <div className="text-gray-500 mb-4">Add Photo</div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                id="dish-photo"
                                onChange={handlePhotoChange}
                            />
                            <label
                                htmlFor="dish-photo"
                                className="bg-pink-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-pink-600"
                            >
                                Upload Photo
                            </label>
                        </div>

                        {/* Add Menu Items Section */}
                        <div className="mt-6 border border-gray-300 rounded-lg p-4">
                            <h3 className="text-lg font-semibold mb-4">Add Menu Items</h3>
                            <textarea
                                name="menuItems"
                                value={menu.menuItems}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                                placeholder="Enter menu items, separated by commas"
                                rows="4"
                            />
                        </div>
                    </div>

                    {/* Add Details Section */}
                    <div className="w-2/3">
                        {/* <h2 className="text-2xl font-semibold mb-6">Add Details</h2> */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-gray-700">Dish Name</label>
                                <input
                                    type="text"
                                    name="dishName"
                                    value={menu.dishName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter dish name"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={menu.price}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter price"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Type of Food</label>
                                <select
                                    name="type"
                                    value={menu.type}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select type</option>
                                    <option value="Veg">Veg</option>
                                    <option value="Non-Veg">Non-Veg</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={menu.category}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="">Select category</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Platinum">Platinum</option>
                                    <option value="Silver">Silver</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700">Description</label>
                                <textarea
                                    name="description"
                                    value={menu.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    placeholder="Enter description"
                                />
                            </div>
                            {/* Categories Section */}
                           
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="mt-6 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
                        >
                            Add Dish
                        </button>
                    </div>
                </div>
            </div>
        </div>




    );
};

export default AddDishes;
