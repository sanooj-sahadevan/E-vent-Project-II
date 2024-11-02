import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/config';
import userRoutes from './routes/userRoutes';
import vendorRoutes from './routes/vendorRoutes';
import adminRoutes from './routes/adminRoutes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server as serverSocket } from 'socket.io';
import chatRoutes from './routes/chatRoutes';
import { socketHandler } from "./utils/socket/chat";
import { errorHandler } from "./middleware/errorHandling";
import logger from "./utils/logger";



dotenv.config();

const app = express();
const PORT = 8080;
const morganFormat = ":method :url :status :response-time ms";


connectToMongoDB();

const httpServer = createServer(app);


export const io = new serverSocket(httpServer, {
  cors: {
    origin: "https://www.eventopia.shop",
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

socketHandler(io);


app.use(cors({
  // origin: 'https://www.eventopia.shop',
  origin: ['https://www.eventopia.shop', 'https://eventopia.shop'],
  credentials: true,
}));


// export const io = new serverSocket(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ['GET', 'POST'],
//     credentials: true,
//   },
// });

// socketHandler(io);

// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true,
// }));

app.use(express.json());
app.use(cookieParser());
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);
app.use('/chat', chatRoutes);
app.use(errorHandler);




httpServer.listen(PORT, () => {
  console.log(`Server started running on http://localhost:${PORT}/`);
});
