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
import { errorHandler } from "./middleware/errorHandling.js";
dotenv.config();
const app = express();
const PORT = 5000;
connectToMongoDB();
const httpServer = createServer(app);
export const io = new serverSocket(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
socketHandler(io);
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);
app.use(errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
