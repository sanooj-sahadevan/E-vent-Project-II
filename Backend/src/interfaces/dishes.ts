import mongoose from "mongoose";

export interface DishDocument  {
    vendorId: mongoose.Schema.Types.ObjectId;
    dishesName: string;
    description?: string;
    menu: string;
    types: string;
    price: number;
    category?: string;
    status: string;
    images?: string
    isDeleted: boolean
  }