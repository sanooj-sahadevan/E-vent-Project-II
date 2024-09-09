import express from 'express';
import cors from 'cors';
import { connectToMongoDB } from './config/config.js';
import userRoutes from './routes/userRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { createStream } from 'rotating-file-stream';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = 5000;

// Derive __dirname from import.meta.url
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// Connect to MongoDB
connectToMongoDB();



// Middleware setup
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Create the log directory if it doesn't exist
// const logDirectory = path.join(__dirname, 'logs');
// fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Setup rotating log stream to keep logs for 30 days
// const accessLogStream = createStream('access.log', {
//   interval: '1d',            // Rotate logs daily
//   path: logDirectory,        // Directory where logs are stored
//   maxFiles: 30,              // Keep logs for 30 days
//   compress: true,            // Compress log files to save space
// });

// Setup morgan to log requests to the rotating log stream
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Route setup
app.use('/user', userRoutes);
app.use('/vendor', vendorRoutes);
app.use('/admin', adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started running on http://localhost:${PORT}/`);
});
