import { dbConnect } from "./config/dbConnect";
import userRouter from "./routes/AuthRoutes";
import { userMiddleware } from './middlewares/userAuthMiddleware';
import { walletRouter } from "./routes/wallet";

import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();

const PORT: string = process.env.PORT || "4000";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://wallet-frontend-eight.vercel.app'],
        credentials: true,               
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        exposedHeaders: ["Authorization"]
    })
);

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/home', userMiddleware as any, (req: Request, res: Response) => {
    res.send("This is Protected Route.");
})
app.use('/api/v1', userMiddleware as any, walletRouter);

app.listen(PORT, async () => {
    await dbConnect()
        .then(() => {
            console.log("Connected to the database successfully!");
        })
        .catch((error) => {
            console.error("Database connection failed:", error);
            process.exit(1);
        });
    console.log(`Server is running on http://localhost:${PORT}`);
});

