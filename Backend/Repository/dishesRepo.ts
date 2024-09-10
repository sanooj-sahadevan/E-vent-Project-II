import mongoose from "mongoose";
import { IDishes, DishesModel } from "../models/dishesModel.js";

// Function to create a dish and save it to the database
export const CreatingDishes = async (DishesData: {
  vendorId: string;
  data: {
    dishName: string;
    description?: string;
    menu: string;
    type: string;
    price: string; // assuming price is passed as a string initially
    category?: string;
    status: string;
    locations?: string; // JSON string to be parsed
  };
  images: string[]; // array of image URLs
}): Promise<IDishes> => {
  try {
    // Parse locations if provided
    if (DishesData.data.locations) {
      DishesData.data.locations = JSON.parse(DishesData.data.locations);
    }

    // Create a new dish instance
    const newDish = new DishesModel({
      vendorId: DishesData.vendorId,
      dishName: DishesData.data.dishName,
      description: DishesData.data.description,
      menu: DishesData.data.menu,
      type: DishesData.data.type,
      price: parseFloat(DishesData.data.price), // converting price to number
      category: DishesData.data.category,
      status: DishesData.data.status,
      images: DishesData.images,
    });

    // Save the new dish to the database
    const savedDishes = await newDish.save();
    console.log("Saved Dishes: ", savedDishes);

    return savedDishes;
  } catch (error: any) {
    console.error("Error saving Dishes: ", error);
    throw new Error(error.message);
  }
};
