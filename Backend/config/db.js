import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            // In development, warn but don't block
            if (process.env.NODE_ENV !== 'production') {
                return null;
            }
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        });
        
        // Connected to MongoDB
        return conn;
    } catch (error) {
        // Connection error - don't exit, let server continue
        // Database operations will fail gracefully
        return null;
    }
}
