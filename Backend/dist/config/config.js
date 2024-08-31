import mongoose from 'mongoose';
export const connectToMongoDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sanooj:babygirl@cluster0.y172y.mongodb.net/', {
            serverSelectionTimeoutMS: 30000,
        });
        console.log('Connected to MongoDB Atlas');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};
