import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_URL: string = process.env.DB_URL || "";

export const dbConnect = async (): Promise<typeof mongoose> => {
    if (!DB_URL) {
        throw new Error("Database URL not provided in environment variables.");
    }
    try {
        return await mongoose.connect(DB_URL);
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
};
