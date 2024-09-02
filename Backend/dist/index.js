import express from 'express';
import cors from "cors";
import { connectToMongoDB } from './config/config.js';
import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import adminRoutes from './routes/adminRoutes.js'; // Corrected import for admin routes
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
const app = express();
const PORT = 5000;
// Connect to MongoDB
connectToMongoDB();
dotenv.config();
// Middleware setup
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
// Route setup
app.use("/user", userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes); // Make sure this route is correct
// Start the server
app.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
