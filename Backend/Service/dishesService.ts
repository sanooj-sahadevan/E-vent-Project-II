import { DishesModel } from "../models/dishesModel";

export class DishesService {
  public async uploadDishes(vendorId: string, data: any, imageUrl: string | undefined): Promise<any> {
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
    } catch (error: any) {
      console.error("Error saving dish: ", error);
      throw new Error(error.message);
    }
  }
}
