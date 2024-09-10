import { DishesModel } from "../models/dishesModel.js";
export class DishesService {
    async uploadDishes(vendorId, data, imageUrl) {
        try {
            const dishData = {
                vendorId,
                dishName: data.dishName,
                description: data.description,
                menu: data.menu,
                type: data.type,
                price: parseFloat(data.price),
                category: data.category,
                status: data.status,
                images: imageUrl ? [imageUrl] : [],
            };
            const newDish = new DishesModel(dishData);
            const savedDish = await newDish.save();
            console.log("Saved Dish: ", savedDish);
            return savedDish;
        }
        catch (error) {
            console.error("Error saving dish: ", error);
            throw new Error(error.message);
        }
    }
}