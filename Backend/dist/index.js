import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/config.js';
import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as serverSocket } from 'socket.io';
import chatRoutes from './routes/chatRoutes.js';
import { socketHandler } from "./utils/socket/chat.js";
dotenv.config();
const app = express();
const PORT = 5000;
// Connect to MongoDB
connectToMongoDB();
const httpServer = createServer(app);
export const io = new serverSocket(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Ensure correct origin
        methods: ['GET', 'POST'],
        credentials: true, // Allow credentials for Socket.IO
    },
});
// Socket Handler
socketHandler(io);
// Middleware setup
app.use(cors({
    origin: 'http://localhost:3000', // Ensure exact origin
    credentials: true, // Enable credentials
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
// Route setup
app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);
// Create HTTP server
// Start the server
httpServer.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
