import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const connectDb=async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("database connected successfully");
        console.log("Connected to database:", mongoose.connection.name);
    } catch (error) {
        console.log('MongoDB connection failed: ', error);
        process.exit(1);
    }

}