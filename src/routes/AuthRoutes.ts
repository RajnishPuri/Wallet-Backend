import express from "express";
import { Register, verificationEmail, login, loggedOut } from "../controllers/userAuth";
import registerRateLimiter from "../middlewares/ratelimiter";

const userRouter = express.Router();

userRouter.post('/register', registerRateLimiter, Register as any);
userRouter.post('/verify-user', verificationEmail as any);
userRouter.post('/login', login as any);
userRouter.post('/logout', loggedOut as any);

export default userRouter;