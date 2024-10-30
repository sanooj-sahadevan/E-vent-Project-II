import mongoose from 'mongoose';

export const connectToMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING!, {
      serverSelectionTimeoutMS: 30000, 
    });
    console.log('Successfully connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }

  mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to DB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from DB');
  });



  
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0); 
  });
};
