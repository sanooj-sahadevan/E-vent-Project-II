import { DishesModel } from "../models/dishesModel.js";
// Function to create a dish and save it to the database
export const CreatingDishes = async (DishesData) => {
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
    }
    catch (error) {
        console.error("Error saving Dishes: ", error);
        throw new Error(error.message);
    }
};
