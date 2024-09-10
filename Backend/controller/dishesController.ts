import { Request, Response, NextFunction } from "express";
import { DishesService } from "../Service/vendorService";

export class DishesController {
  private dishesService: DishesService;

  constructor(dishesService: DishesService) {
    this.dishesService = dishesService;
  }

  public async addDishes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;
      const vendorId:any = req.vendorId; // Assuming vendorId is coming from middleware

      const dishData = await this.dishesService.uploadDishes(vendorId, body);
      if (dishData) {
        res.status(200).json({ message: "Dish added successfully" });
      } else {
        res.status(400).json({ error: "Dish not added - something went wrong" });
      }
    } catch (error) {
      console.error("Error: ", error);
      next(error);
    }
  }
}
