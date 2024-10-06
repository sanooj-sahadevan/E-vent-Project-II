import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './src/config/config.js';
import userRoutes from './src/routes/userRoutes.js';
import vendorRoutes from './src/routes/vendorRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as serverSocket } from 'socket.io';
import chatRoutes from './src/routes/chatRoutes.js';
import { socketHandler } from "./src/utils/socket/chat.js";
import { errorHandler } from "./src/middleware/errorHandling.js";
import logger from "./src/utils/logger.js";
dotenv.config();
const app = express();
const PORT = 5000;
const morganFormat = ":method :url :status :response-time ms";
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
app.use(morgan(morganFormat, {
    stream: {
        write: (message) => {
            const logObject = {
                method: message.split(" ")[0],
                url: message.split(" ")[1],
                status: message.split(" ")[2],
                responseTime: message.split(" ")[3],
            };
            logger.info(JSON.stringify(logObject));
        },
    },
}));
// app.use(morgan('dev'));
app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);
app.use(errorHandler);
httpServer.listen(PORT, () => {
    console.log(`Server started running on http://localhost:${PORT}/`);
});
