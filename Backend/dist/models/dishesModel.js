// export interface Dishes {
//     dishName: string;
//     category?: string;
//     menu: string;
//     type: string;
//     profileImage?: string;
//     description?: string;
//     vendorID :string
// }
import mongoose, { Schema } from "mongoose";
// Dishes Schema
const DishesSchema = new Schema({
    vendorId: { type: String, required: true },
    dishName: { type: String, required: true },
    description: { type: String },
    menu: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
    status: { type: String, required: true },
    images: [{ type: String }],
});
// Export Dishes model
export const DishesModel = mongoose.model("Dishes", DishesSchema);
